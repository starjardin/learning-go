CREATE TABLE "categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL UNIQUE
);

-- Seed initial categories
INSERT INTO categories (name, value) VALUES
    ('Clothing', 'CLOTHING'),
    ('Accessories', 'ACCESSORIES'),
    ('Sports', 'SPORTS'),
    ('Electronics', 'ELECTRONICS'),
    ('Home & Garden', 'HOME_AND_GARDEN'),
    ('Books', 'BOOKS');
