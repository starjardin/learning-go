package graph

import (
	"crypto/rand"
	"encoding/hex"
)

// generateVerificationToken creates a secure random token for email verification
func generateVerificationToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
