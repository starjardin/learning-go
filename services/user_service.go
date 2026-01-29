package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/rs/zerolog"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/mail"
	"github.com/starjardin/onja-products/token"
	"github.com/starjardin/onja-products/utils"
)

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
		verifyUrl := fmt.Sprintf("%s/v1/verify_email?email_id=%d&secret_code=%s",
			s.config.BaseURL, emailVerification.ID, emailVerification.Token)

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
