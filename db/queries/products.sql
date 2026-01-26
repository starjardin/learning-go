-- name: GetProducts :many
SELECT * FROM products
WHERE (sqlc.narg('category')::text IS NULL OR category = sqlc.narg('category'))
  AND (sqlc.narg('sold')::bool IS NULL OR sold = sqlc.narg('sold'))
  AND (sqlc.narg('is_negotiable')::bool IS NULL OR is_negotiable = sqlc.narg('is_negotiable'))
  AND (sqlc.narg('search')::text IS NULL OR sqlc.narg('search')::text = '' OR name ILIKE '%' || sqlc.narg('search') || '%' OR description ILIKE '%' || sqlc.narg('search') || '%');

-- name: GetProduct :one
SELECT * FROM products WHERE id = $1 LIMIT 1;

-- name: CreateProduct :one
INSERT INTO products (name, description, price, created_at, updated_at, owner_id, company_id, image_link, available_stocks, is_negotiable, category)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    sold = coalesce(sqlc.narg('sold'), sold),
    category = coalesce(sqlc.narg('category'), category)
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteProduct :one
DELETE FROM products WHERE id = $1 RETURNING *;

-- name: GetProductsAdvanced :many
SELECT * FROM products 
WHERE 
  ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
  AND ($2::int4 IS NULL OR price >= $2)
  AND ($3::int4 IS NULL OR price <= $3)
  AND ($4::int4 IS NULL OR available_stocks >= $4)
  AND ($5::bool IS NULL OR sold = $5)
  AND ($6::int4 IS NULL OR company_id = $6)
ORDER BY 
  CASE WHEN $7 = 'price_asc' THEN price END ASC,
  CASE WHEN $7 = 'price_desc' THEN price END DESC,
  CASE WHEN $7 = 'created_desc' THEN created_at END DESC,
  CASE WHEN $7 = 'created_asc' THEN created_at END ASC,
  id DESC
LIMIT $8 OFFSET $9;

-- name: GetProductsByOwner :many
SELECT * FROM products 
WHERE owner_id = $1
ORDER BY created_at DESC;

-- name: GetProductCount :one
SELECT COUNT(*) FROM products 
WHERE 
  ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
  AND ($2::int4 IS NULL OR price >= $2)
  AND ($3::int4 IS NULL OR price <= $3)
  AND ($4::int4 IS NULL OR available_stocks >= $4)
  AND ($5::bool IS NULL OR sold = $5)
  AND ($6::int4 IS NULL OR company_id = $6);
