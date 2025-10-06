-- ============================================
-- ONJA PRODUCTS DATABASE SCHEMA ROLLBACK
-- ============================================

-- Drop triggers first (they depend on functions)
DROP TRIGGER IF EXISTS update_product_likes_count_trigger ON product_likes;
DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON social_accounts;
DROP TRIGGER IF EXISTS update_user_security_updated_at ON user_security;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;

-- Drop functions
DROP FUNCTION IF EXISTS update_product_likes_count();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
-- Auth-related indexes
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_social_accounts_provider;
DROP INDEX IF EXISTS idx_social_accounts_user_id;
DROP INDEX IF EXISTS idx_login_history_created_at;
DROP INDEX IF EXISTS idx_login_history_user_id;
DROP INDEX IF EXISTS idx_user_sessions_expires_at;
DROP INDEX IF EXISTS idx_user_sessions_token;
DROP INDEX IF EXISTS idx_user_sessions_user_id;
DROP INDEX IF EXISTS idx_password_resets_token;
DROP INDEX IF EXISTS idx_password_resets_user_id;
DROP INDEX IF EXISTS idx_email_verifications_token;
DROP INDEX IF EXISTS idx_email_verifications_user_id;

-- Product likes indexes
DROP INDEX IF EXISTS idx_product_likes_user_id;
DROP INDEX IF EXISTS idx_product_likes_product_id;

-- Products indexes
DROP INDEX IF EXISTS idx_products_created_at;
DROP INDEX IF EXISTS idx_products_sold;
DROP INDEX IF EXISTS idx_products_company_id;
DROP INDEX IF EXISTS idx_products_owner_id;

-- Users indexes
DROP INDEX IF EXISTS idx_users_created_at;
DROP INDEX IF EXISTS idx_users_company_id;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables in reverse dependency order
-- Drop junction tables first
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS product_likes;

-- Drop dependent tables
DROP TABLE IF EXISTS social_accounts;
DROP TABLE IF EXISTS user_security;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS email_verifications;
DROP TABLE IF EXISTS roles;

-- Drop main tables (products depends on users, users depends on companies)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS companies;