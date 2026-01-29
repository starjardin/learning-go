package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Store defines all functions to execute db queries and transactions
type Store interface {
	Querier
	CreateUserTx(ctx context.Context, arg CreateUserTxParams) (CreateUserTxResult, error)
}

// SQLStore provides all functions to execute SQL queries and transactions
type SQLStore struct {
	connPool *pgxpool.Pool
	*Queries
}

// NewStore creates a new store
func NewStore(connPool *pgxpool.Pool) Store {
	return &SQLStore{
		connPool: connPool,
		Queries:  New(connPool),
	}
}

// execTx executes a function within a database transaction
func (store *SQLStore) execTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := store.connPool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}

	q := New(tx)
	err = fn(q)
	if err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit(ctx)
}

// CreateUserTxParams contains the input parameters for creating a user with transaction
type CreateUserTxParams struct {
	CreateUserParams CreateUserParams
	// SendEmail is called after all DB operations succeed but before commit
	// If it returns an error, the transaction will be rolled back
	SendEmail func(user User, emailVerification EmailVerification) error
}

// CreateUserTxResult is the result of the CreateUserTx transaction
type CreateUserTxResult struct {
	User              User
	UserSecurity      UserSecurity
	EmailVerification EmailVerification
}

// CreateUserTx performs a user creation with all related records in a single transaction
// It creates the user, user security, and email verification records
// Then sends the verification email - if any step fails, the entire transaction is rolled back
func (store *SQLStore) CreateUserTx(ctx context.Context, arg CreateUserTxParams) (CreateUserTxResult, error) {
	var result CreateUserTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		// Step 1: Create the user
		result.User, err = q.CreateUser(ctx, arg.CreateUserParams)
		if err != nil {
			return fmt.Errorf("failed to create user: %w", err)
		}

		// Step 2: Create user security record
		result.UserSecurity, err = q.CreateUserSecurity(ctx, CreateUserSecurityParams{
			UserID:            result.User.ID,
			SecurityQuestions: []byte("[]"),
		})
		if err != nil {
			return fmt.Errorf("failed to create user security: %w", err)
		}

		// Step 3: Generate verification token and create email verification
		verificationToken, err := generateSecureToken()
		if err != nil {
			return fmt.Errorf("failed to generate verification token: %w", err)
		}

		result.EmailVerification, err = q.CreateEmailVerification(ctx, CreateEmailVerificationParams{
			UserID:    result.User.ID,
			Token:     verificationToken,
			ExpiresAt: expiresIn24Hours(),
		})
		if err != nil {
			return fmt.Errorf("failed to create email verification: %w", err)
		}

		// Step 4: Send verification email (within transaction - rollback if fails)
		if arg.SendEmail != nil {
			if err := arg.SendEmail(result.User, result.EmailVerification); err != nil {
				return fmt.Errorf("failed to send verification email: %w", err)
			}
		}

		return nil
	})

	return result, err
}
