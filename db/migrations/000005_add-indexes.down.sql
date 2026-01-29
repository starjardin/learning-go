-- Drop indexes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;

DROP INDEX IF EXISTS idx_products_owner_id;
DROP INDEX IF EXISTS idx_products_company_id;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_sold;
DROP INDEX IF EXISTS idx_products_created_at;
DROP INDEX IF EXISTS idx_products_category_sold;

DROP INDEX IF EXISTS idx_cart_items_user_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;

DROP INDEX IF EXISTS idx_email_verifications_token;
DROP INDEX IF EXISTS idx_email_verifications_user_id;
