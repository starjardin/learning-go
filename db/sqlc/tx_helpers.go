package db

import (
	"crypto/rand"
	"encoding/hex"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func generateSecureToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func expiresIn24Hours() pgtype.Timestamptz {
	return pgtype.Timestamptz{Time: time.Now().Add(24 * time.Hour), Valid: true}
}
