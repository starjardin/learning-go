package services

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"regexp"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/rs/zerolog"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/mail"
	"github.com/starjardin/onja-products/token"
	"github.com/starjardin/onja-products/utils"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

func isValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

func generateSecureToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// UserService handles user-related business logic
type UserService struct {
	store      db.Store
	tokenMaker token.Maker
	config     utils.Config
	logger     zerolog.Logger
}

// NewUserService creates a new UserService
func NewUserService(store db.Store, tokenMaker token.Maker, config utils.Config, logger zerolog.Logger) *UserService {
	return &UserService{
		store:      store,
		tokenMaker: tokenMaker,
		config:     config,
		logger:     logger.With().Str("service", "user").Logger(),
	}
}

// CreateUserParams contains the input for creating a user
type CreateUserParams struct {
	Username      string
	Password      string
	Email         string
	FullName      string
	Address       string
	PhoneNumber   string
	PaymentMethod string
	CompanyID     *int
}

// CreateUserResult contains the result of user creation
type CreateUserResult struct {
	User    db.User
	Message string
}

// CreateUser creates a new user with validation and transaction
func (s *UserService) CreateUser(ctx context.Context, params CreateUserParams) (*CreateUserResult, error) {
	s.logger.Info().Str("email", params.Email).Msg("creating new user")

	// Validate input
	validator := utils.UserInputValidator{
		Username:      params.Username,
		Email:         params.Email,
		Password:      params.Password,
		FullName:      params.FullName,
		Address:       params.Address,
		PhoneNumber:   params.PhoneNumber,
		PaymentMethod: params.PaymentMethod,
	}
	if errs := validator.Validate(); errs.HasErrors() {
		s.logger.Warn().Err(errs).Msg("validation failed")
		return nil, fmt.Errorf("validation failed: %w", errs)
	}

	// Check if user already exists
	existingUser, err := s.store.GetUserByEmail(ctx, params.Email)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		s.logger.Error().Err(err).Msg("failed to check if user exists")
		return nil, fmt.Errorf("failed to check if user exists: %w", err)
	}
	if err == nil && existingUser.Email == params.Email {
		s.logger.Warn().Str("email", params.Email).Msg("user already exists")
		return nil, fmt.Errorf("user with email %s already exists", params.Email)
	}

	// Hash password
	hashedPassword, err := utils.HashedPassword(params.Password)
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to hash password")
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Prepare company ID
	var companyID pgtype.Int4
	if params.CompanyID != nil {
		companyID = pgtype.Int4{Valid: true, Int32: int32(*params.CompanyID)}
	}

	// Create email sender function
	sendEmailFn := func(user db.User, emailVerification db.EmailVerification) error {
		verifyUrl := fmt.Sprintf("%s/verify-email?token=%s",
			s.config.FrontendURL, emailVerification.Token)

		subject := "Welcome to Super Product"
		content := fmt.Sprintf(`
			<h1>Hello %s</h1>
			<p>Thank you for registering with Super Product.</p>
			<p>Please <a href="%s">Click here</a> to verify your email address.</p>
		`, user.FullName, verifyUrl)

		sender := mail.NewGmailSender("", s.config.EmailSenderAddress, s.config.EmailSenderPassword)
		return sender.SendEmail(subject, content, []string{user.Email}, nil, nil, nil)
	}

	// Execute transaction
	result, err := s.store.CreateUserTx(ctx, db.CreateUserTxParams{
		CreateUserParams: db.CreateUserParams{
			Username:          params.Username,
			HashedPassword:    hashedPassword,
			Email:             params.Email,
			FullName:          params.FullName,
			Address:           pgtype.Text{String: params.Address, Valid: params.Address != ""},
			PhoneNumber:       pgtype.Text{String: params.PhoneNumber, Valid: params.PhoneNumber != ""},
			PaymentMethod:     pgtype.Text{String: params.PaymentMethod, Valid: params.PaymentMethod != ""},
			PasswordChangedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
			CompanyID:         companyID,
		},
		SendEmail: sendEmailFn,
	})
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to create user")
		return nil, err
	}

	s.logger.Info().Int32("userID", result.User.ID).Msg("user created successfully")

	return &CreateUserResult{
		User:    result.User,
		Message: "Account created successfully. Please check your email to verify your account.",
	}, nil
}

// LoginParams contains the input for login
type LoginParams struct {
	Email    string
	Password string
}

// LoginResult contains the result of login
type LoginResult struct {
	User         db.User
	AccessToken  string
	RefreshToken string
}

// Login authenticates a user and returns tokens
func (s *UserService) Login(ctx context.Context, params LoginParams) (*LoginResult, error) {
	s.logger.Info().Str("email", params.Email).Msg("user login attempt")

	// Validate input
	validator := utils.LoginInputValidator{
		Email:    params.Email,
		Password: params.Password,
	}
	if errs := validator.Validate(); errs.HasErrors() {
		return nil, fmt.Errorf("validation failed: %w", errs)
	}

	// Get user by email
	user, err := s.store.GetUserByEmail(ctx, params.Email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			s.logger.Warn().Str("email", params.Email).Msg("user not found")
			return nil, fmt.Errorf("invalid email or password")
		}
		s.logger.Error().Err(err).Msg("failed to find user")
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	// Check password
	if err := utils.CheckPassword(params.Password, user.HashedPassword); err != nil {
		s.logger.Warn().Str("email", params.Email).Msg("invalid password")
		return nil, fmt.Errorf("invalid email or password")
	}

	// Check if email is verified
	if !user.IsVerified.Valid || !user.IsVerified.Bool {
		s.logger.Warn().Str("email", params.Email).Msg("email not verified")
		return nil, fmt.Errorf("please verify your email before logging in")
	}

	// Create tokens
	accessToken, _, err := s.tokenMaker.CreateToken(user.Username, "user", 24*time.Hour)
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to create access token")
		return nil, fmt.Errorf("failed to create access token: %w", err)
	}

	refreshToken, _, err := s.tokenMaker.CreateToken(user.Username, "user", 7*24*time.Hour)
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to create refresh token")
		return nil, fmt.Errorf("failed to create refresh token: %w", err)
	}

	s.logger.Info().Int32("userID", user.ID).Msg("user logged in successfully")

	return &LoginResult{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// VerifyEmailResult contains the result of email verification
type VerifyEmailResult struct {
	User         db.User
	AccessToken  string
	RefreshToken string
}

// VerifyEmail verifies a user's email and returns tokens
func (s *UserService) VerifyEmail(ctx context.Context, token string) (*VerifyEmailResult, error) {
	s.logger.Info().Msg("verifying email")

	verification, err := s.store.GetEmailVerificationByToken(ctx, token)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("invalid or expired verification token")
		}
		return nil, fmt.Errorf("failed to verify token: %w", err)
	}

	_, err = s.store.MarkEmailVerified(ctx, token)
	if err != nil {
		return nil, fmt.Errorf("failed to mark email as verified: %w", err)
	}

	user, err := s.store.UpdateUserIsVerified(ctx, verification.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to update user verification status: %w", err)
	}

	accessToken, _, err := s.tokenMaker.CreateToken(user.Username, "user", 24*time.Hour)
	if err != nil {
		return nil, fmt.Errorf("failed to create access token: %w", err)
	}

	refreshToken, _, err := s.tokenMaker.CreateToken(user.Username, "user", 7*24*time.Hour)
	if err != nil {
		return nil, fmt.Errorf("failed to create refresh token: %w", err)
	}

	s.logger.Info().Int32("userID", user.ID).Msg("email verified successfully")

	return &VerifyEmailResult{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// ForgotPassword generates a password reset token and sends a reset email.
// Always returns nil to avoid leaking whether an email exists.
func (s *UserService) ForgotPassword(ctx context.Context, email string) error {
	s.logger.Info().Str("email", email).Msg("password reset requested")

	if !isValidEmail(email) {
		return fmt.Errorf("invalid email format")
	}

	user, err := s.store.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// Don't reveal whether the email exists
			s.logger.Warn().Str("email", email).Msg("password reset for non-existent email")
			return nil
		}
		s.logger.Error().Err(err).Msg("failed to look up user for password reset")
		return fmt.Errorf("internal error")
	}

	// Invalidate any existing reset tokens for this user
	_ = s.store.InvalidateUserPasswordResets(ctx, user.ID)

	// Generate a secure token
	resetToken, err := generateSecureToken()
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to generate reset token")
		return fmt.Errorf("internal error")
	}

	// Create password reset record (expires in 1 hour)
	_, err = s.store.CreatePasswordReset(ctx, db.CreatePasswordResetParams{
		UserID:    user.ID,
		Token:     resetToken,
		ExpiresAt: pgtype.Timestamptz{Time: time.Now().Add(1 * time.Hour), Valid: true},
	})
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to create password reset record")
		return fmt.Errorf("internal error")
	}

	// Send reset email
	resetURL := fmt.Sprintf("%s/reset-password?token=%s", s.config.FrontendURL, resetToken)
	subject := "Password Reset - Super Product"
	content := fmt.Sprintf(`
		<h1>Hello %s</h1>
		<p>We received a request to reset your password.</p>
		<p>Please <a href="%s">click here</a> to reset your password.</p>
		<p>This link will expire in 1 hour.</p>
		<p>If you did not request a password reset, please ignore this email.</p>
	`, user.FullName, resetURL)

	sender := mail.NewGmailSender("", s.config.EmailSenderAddress, s.config.EmailSenderPassword)
	if err := sender.SendEmail(subject, content, []string{user.Email}, nil, nil, nil); err != nil {
		s.logger.Error().Err(err).Msg("failed to send password reset email")
		return fmt.Errorf("failed to send password reset email: %w", err)
	}

	s.logger.Info().Int32("userID", user.ID).Msg("password reset email sent")
	return nil
}

// ResetPassword validates the reset token and updates the user's password.
func (s *UserService) ResetPassword(ctx context.Context, token string, newPassword string) error {
	s.logger.Info().Msg("processing password reset")

	if len(newPassword) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	// Look up the reset token
	reset, err := s.store.GetPasswordResetByToken(ctx, token)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return fmt.Errorf("invalid or expired reset token")
		}
		s.logger.Error().Err(err).Msg("failed to look up reset token")
		return fmt.Errorf("internal error")
	}

	// Hash the new password
	hashedPassword, err := utils.HashedPassword(newPassword)
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to hash new password")
		return fmt.Errorf("internal error")
	}

	// Update user password
	_, err = s.store.UpdateUser(ctx, db.UpdateUserParams{
		ID:                reset.UserID,
		HashedPassword:    pgtype.Text{Valid: true, String: hashedPassword},
		PasswordChangedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
	})
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to update user password")
		return fmt.Errorf("failed to update password")
	}

	// Mark reset token as used
	_, err = s.store.MarkPasswordResetUsed(ctx, token)
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to mark reset token as used")
	}

	s.logger.Info().Int32("userID", reset.UserID).Msg("password reset successfully")
	return nil
}

// GetUser retrieves a user by ID
func (s *UserService) GetUser(ctx context.Context, userID int32) (db.User, error) {
	user, err := s.store.GetUser(ctx, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.User{}, fmt.Errorf("user not found")
		}
		return db.User{}, fmt.Errorf("failed to get user: %w", err)
	}
	return user, nil
}

// GetUsers retrieves all users
func (s *UserService) GetUsers(ctx context.Context) ([]db.User, error) {
	return s.store.GetUsers(ctx)
}
