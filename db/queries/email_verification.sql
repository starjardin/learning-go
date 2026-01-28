-- name: CreateEmailVerification :one
INSERT INTO email_verifications (
    user_id,
    token,
    expires_at,
    created_at
) VALUES (
    $1, 
    $2,
    $3, 
    CURRENT_TIMESTAMP
)
RETURNING *;

-- name: GetEmailVerificationByToken :one
SELECT * FROM email_verifications
WHERE token = $1 AND verified_at IS NULL AND expires_at > CURRENT_TIMESTAMP
LIMIT 1;

-- name: MarkEmailVerified :one
UPDATE email_verifications
SET verified_at = CURRENT_TIMESTAMP
WHERE token = $1 AND verified_at IS NULL
RETURNING *;

-- name: UpdateUserIsVerified :one
UPDATE users
SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: DeleteExpiredEmailVerifications :exec
DELETE FROM email_verifications
WHERE expires_at < CURRENT_TIMESTAMP AND verified_at IS NULL;
