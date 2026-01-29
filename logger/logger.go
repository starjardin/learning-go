package logger

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

func New(env string) zerolog.Logger {
	var logger zerolog.Logger

	if env == "development" {
		output := zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
		}
		logger = zerolog.New(output).
			With().
			Timestamp().
			Caller().
			Logger()
	} else {
		logger = zerolog.New(os.Stdout).
			With().
			Timestamp().
			Logger()
	}

	zerolog.SetGlobalLevel(zerolog.InfoLevel)
	if env == "development" {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}

	return logger
}

func WithRequestID(logger zerolog.Logger, requestID string) zerolog.Logger {
	return logger.With().Str("request_id", requestID).Logger()
}

func WithUserID(logger zerolog.Logger, userID int64) zerolog.Logger {
	return logger.With().Int64("user_id", userID).Logger()
}
