-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;

-- name: GetUsers :many
SELECT * FROM users
ORDER BY id;

-- name: CreateUser :one
INSERT INTO users (username, hashed_password, email, full_name, address, phone_number, payment_method, password_changed_at, company_id, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET 
    username = coalesce(sqlc.narg('username'), username),
    hashed_password = coalesce(sqlc.narg('hashed_password'), hashed_password),
    email = coalesce(sqlc.narg('email'), email),
    full_name = coalesce(sqlc.narg('full_name'), full_name),
    address = coalesce(sqlc.narg('address'), address),
    phone_number = coalesce(sqlc.narg('phone_number'), phone_number),
    payment_method = coalesce(sqlc.narg('payment_method'), payment_method),
    password_changed_at = coalesce(sqlc.narg('password_changed_at'), password_changed_at),
    company_id = coalesce(sqlc.narg('company_id'), company_id)
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;
-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1 LIMIT 1;
