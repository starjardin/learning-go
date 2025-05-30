-- name: GetCompanies :many
SELECT * FROM companies
ORDER BY id;

-- name: GetCompany :one
SELECT * FROM companies
WHERE id = $1 LIMIT 1;

-- name: CreateCompany :one
INSERT INTO companies (name)
VALUES ($1)
RETURNING *;

-- name: UpdateCompany :one
UPDATE companies
SET name = $2
WHERE id = $1
RETURNING *;

-- name: DeleteCompany :exec
DELETE FROM companies
WHERE id = $1;

-- name: GetCompanyByName :one
SELECT * FROM companies
WHERE name = $1 LIMIT 1;

-- name: GetCompanyById :one
SELECT * FROM companies
WHERE id = $1 LIMIT 1;

-- name: GetCompanyByNameOrId :one
SELECT * FROM companies
WHERE name = $1 OR id = $1 LIMIT 1;

-- name: GetCompaniesByNameOrId :many
SELECT * FROM companies
WHERE name = $1 OR id = $1
ORDER BY id;