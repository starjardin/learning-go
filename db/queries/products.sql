-- name: GetProducts :many
SELECT * FROM products;

-- name: GetProduct :one
SELECT * FROM products WHERE id = $1 LIMIT 1;

-- name: CreateProduct :one
INSERT INTO products (name, description, price, created_at, updated_at, owner_id, company_id, image_link, available_stocks, is_negotiable)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: SearchProducts :many
SELECT * FROM products
WHERE name ILIKE '%' || $1 || '%'
OR description ILIKE '%' || $1 || '%'
ORDER BY id;

-- name: UpdateProduct :one
UPDATE products
SET 
    name = coalesce(sqlc.narg('name'), name),
    description = coalesce(sqlc.narg('description'), description),
    price = coalesce(sqlc.narg('price'), price),
    image_link = coalesce(sqlc.narg('image_link'), image_link),
    available_stocks = coalesce(sqlc.narg('available_stocks'), available_stocks),
    is_negotiable = coalesce(sqlc.narg('is_negotiable'), is_negotiable),
    company_id = coalesce(sqlc.narg('company_id'), company_id),
    sold = coalesce(sqlc.narg('sold'), sold)
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteProduct :one
DELETE FROM products WHERE id = $1 RETURNING *;
