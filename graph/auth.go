package graph

import (
	"context"
	"fmt"
	"strings"
	"github.com/starjardin/onja-products/token"
	db "github.com/starjardin/onja-products/db/sqlc"
)

// AuthContext holds authentication information in context
type AuthContext struct {
	UserID   int64
	Username string
	Role     string
}

// contextKey is used to store values in the context safely
type contextKey string

const authContextKey = contextKey("auth")

// GetAuthFromContext extracts authentication information from request context
func GetAuthFromContext(ctx context.Context) (*AuthContext, error) {
	auth, ok := ctx.Value(authContextKey).(*AuthContext)
	if !ok {
		return nil, fmt.Errorf("authentication required")
	}
	return auth, nil
}

// SetAuthContext stores authentication information in context
func SetAuthContext(ctx context.Context, userID int64, username, role string) context.Context {
	authCtx := &AuthContext{
		UserID:   userID,
		Username: username,
		Role:     role,
	}
	return context.WithValue(ctx, authContextKey, authCtx)
}

// ExtractTokenFromHeader extracts JWT token from Authorization header
func ExtractTokenFromHeader(authHeader string) (string, error) {
	if authHeader == "" {
		return "", fmt.Errorf("authorization header is required")
	}

	fields := strings.Fields(authHeader)
	if len(fields) != 2 || fields[0] != "Bearer" {
		return "", fmt.Errorf("invalid authorization header format")
	}

	return fields[1], nil
}

// ValidateTokenAndGetUser validates JWT token and returns user information
func (r *Resolver) ValidateTokenAndGetUser(ctx context.Context, tokenStr string) (*AuthContext, error) {
	// Get token maker from context
	tokenMaker, ok := ctx.Value("tokenMaker").(token.Maker)
	if !ok {
		return nil, fmt.Errorf("token maker not found in context")
	}

	// Get queries from context
	queries, ok := ctx.Value("queries").(*db.Queries)
	if !ok {
		return nil, fmt.Errorf("queries not found in context")
	}

	// Verify the token
	payload, err := tokenMaker.VerifyToken(tokenStr)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	// Get user from database to get user ID
	user, err := queries.GetUserByUsername(ctx, payload.Username)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	// Create auth context
	authCtx := &AuthContext{
		UserID:   int64(user.ID),
		Username: user.Username,
		Role:     payload.Role,
	}

	return authCtx, nil
}
