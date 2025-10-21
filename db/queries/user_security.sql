-- name: CreateUserSecurity :one
INSERT INTO user_security (
    user_id,
    failed_login_attempts,
    last_failed_login,
    is_locked,
    account_locked_until,
    security_questions,
    created_at,
    updated_at
) VALUES (
    $1, 
    0, 
    NULL, 
    FALSE, 
    NULL, 
    $2, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
)
RETURNING *;