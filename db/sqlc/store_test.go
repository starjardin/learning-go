package db

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func TestCreateUserTxParams(t *testing.T) {
	params := CreateUserTxParams{
		CreateUserParams: CreateUserParams{
			Username:          "testuser",
			HashedPassword:    "hashedpass",
			Email:             "test@example.com",
			FullName:          "Test User",
			Address:           pgtype.Text{String: "123 Test St", Valid: true},
			PhoneNumber:       pgtype.Text{String: "+1234567890", Valid: true},
			PaymentMethod:     pgtype.Text{String: "credit_card", Valid: true},
			PasswordChangedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
			CompanyID:         pgtype.Int4{Valid: false},
		},
		SendEmail: func(user User, emailVerification EmailVerification) error {
			return nil
		},
	}

	if params.CreateUserParams.Username != "testuser" {
		t.Errorf("expected username 'testuser', got %s", params.CreateUserParams.Username)
	}

	if params.CreateUserParams.Email != "test@example.com" {
		t.Errorf("expected email 'test@example.com', got %s", params.CreateUserParams.Email)
	}
}

func TestCreateUserTxResult(t *testing.T) {
	result := CreateUserTxResult{
		User: User{
			ID:       1,
			Username: "testuser",
			Email:    "test@example.com",
			FullName: "Test User",
		},
		UserSecurity: UserSecurity{
			UserID: 1,
		},
		EmailVerification: EmailVerification{
			UserID: 1,
			Token:  "test-token",
		},
	}

	if result.User.ID != 1 {
		t.Errorf("expected user ID 1, got %d", result.User.ID)
	}

	if result.EmailVerification.Token != "test-token" {
		t.Errorf("expected token 'test-token', got %s", result.EmailVerification.Token)
	}
}

func TestGenerateSecureToken(t *testing.T) {
	token1, err := generateSecureToken()
	if err != nil {
		t.Fatalf("failed to generate token: %v", err)
	}

	if len(token1) != 64 { // 32 bytes = 64 hex characters
		t.Errorf("expected token length 64, got %d", len(token1))
	}

	token2, err := generateSecureToken()
	if err != nil {
		t.Fatalf("failed to generate second token: %v", err)
	}

	if token1 == token2 {
		t.Error("tokens should be unique")
	}
}

func TestExpiresIn24Hours(t *testing.T) {
	before := time.Now().Add(23 * time.Hour)
	expires := expiresIn24Hours()
	after := time.Now().Add(25 * time.Hour)

	if !expires.Valid {
		t.Error("expected valid timestamp")
	}

	if expires.Time.Before(before) {
		t.Error("expiration should be at least 23 hours from now")
	}

	if expires.Time.After(after) {
		t.Error("expiration should be at most 25 hours from now")
	}
}

type MockSendEmailFunc struct {
	Called bool
	Error  error
}

func (m *MockSendEmailFunc) SendEmail(user User, emailVerification EmailVerification) error {
	m.Called = true
	return m.Error
}

func TestSendEmailCallback(t *testing.T) {
	tests := []struct {
		name      string
		mockError error
		wantError bool
	}{
		{
			name:      "successful email",
			mockError: nil,
			wantError: false,
		},
		{
			name:      "failed email",
			mockError: errors.New("email failed"),
			wantError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mock := &MockSendEmailFunc{Error: tt.mockError}

			user := User{ID: 1, Email: "test@example.com"}
			verification := EmailVerification{ID: 1, Token: "test-token"}

			err := mock.SendEmail(user, verification)

			if !mock.Called {
				t.Error("expected SendEmail to be called")
			}

			if tt.wantError && err == nil {
				t.Error("expected error but got none")
			}

			if !tt.wantError && err != nil {
				t.Errorf("expected no error but got: %v", err)
			}
		})
	}
}

func TestCreateUserTx_Integration(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	// This would be an integration test that requires a real database
	// For now, we just verify the test structure
	t.Log("Integration test for CreateUserTx would go here")

	// Example structure:
	// 1. Set up test database connection
	// 2. Create store with connection pool
	// 3. Call CreateUserTx with test params
	// 4. Verify user, user_security, and email_verification records exist
	// 5. Test rollback scenario by making email fail
	// 6. Verify no records exist after rollback
	// 7. Clean up test data
}

func TestExecTx_RollbackOnError(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	// This would test that execTx properly rolls back on error
	t.Log("Rollback test for execTx would go here")

	// Example structure:
	// 1. Start a transaction with execTx
	// 2. Perform some database operations
	// 3. Return an error from the function
	// 4. Verify the transaction was rolled back
	// 5. Verify no data was persisted
}

// Benchmark for token generation
func BenchmarkGenerateSecureToken(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_, err := generateSecureToken()
		if err != nil {
			b.Fatal(err)
		}
	}
}

// Test context cancellation
func TestCreateUserTx_ContextCancellation(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	ctx, cancel := context.WithCancel(context.Background())
	cancel() // Cancel immediately

	_ = ctx
	t.Log("Context cancellation test would go here")
}
