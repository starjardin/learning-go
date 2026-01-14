-- name: CreateUserSecurity :one
INSERT INTO user_security (
    user_id,
    two_factor_enabled,
    failed_login_attempts,
    account_locked_until,
    security_questions,
    created_at,
    updated_at
) VALUES (
    $1, 
    FALSE,
    0, 
    NULL, 
    $2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
)
RETURNING *;