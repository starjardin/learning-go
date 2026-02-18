-- name: CreatePasswordReset :one
INSERT INTO password_resets (
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

-- name: GetPasswordResetByToken :one
SELECT * FROM password_resets
WHERE token = $1 AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP
LIMIT 1;

-- name: MarkPasswordResetUsed :one
UPDATE password_resets
SET used_at = CURRENT_TIMESTAMP
WHERE token = $1 AND used_at IS NULL
RETURNING *;

-- name: DeleteExpiredPasswordResets :exec
DELETE FROM password_resets
WHERE expires_at < CURRENT_TIMESTAMP AND used_at IS NULL;

-- name: InvalidateUserPasswordResets :exec
UPDATE password_resets
SET used_at = CURRENT_TIMESTAMP
WHERE user_id = $1 AND used_at IS NULL;
