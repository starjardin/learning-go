-- name: GetCartItems :many
SELECT ci.*, p.name, p.price, p.image_link, p.available_stocks
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = $1
ORDER BY ci.created_at DESC;

-- name: GetCartItem :one
SELECT * FROM cart_items
WHERE user_id = $1 AND product_id = $2
LIMIT 1;

-- name: AddToCart :one
INSERT INTO cart_items (user_id, product_id, quantity, created_at, updated_at)
VALUES ($1, $2, $3, NOW(), NOW())
ON CONFLICT (user_id, product_id)
DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()
RETURNING *;

-- name: UpdateCartItemQuantity :one
UPDATE cart_items
SET quantity = $3, updated_at = NOW()
WHERE user_id = $1 AND product_id = $2
RETURNING *;

-- name: RemoveFromCart :exec
DELETE FROM cart_items
WHERE user_id = $1 AND product_id = $2;

-- name: ClearCart :exec
DELETE FROM cart_items
WHERE user_id = $1;

-- name: GetCartItemCount :one
SELECT COALESCE(SUM(quantity), 0)::int as total_items
FROM cart_items
WHERE user_id = $1;
