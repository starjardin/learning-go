-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUsers :many
SELECT * FROM users
ORDER BY id;

-- name: CreateUser :one
INSERT INTO users (username, hashed_password, email, full_name, address, phone_number, payment_method, password_change_at, company_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;