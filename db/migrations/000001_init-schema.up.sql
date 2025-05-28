CREATE TABLE "companies" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar NOT NULL UNIQUE,
  "hashed_password" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "full_name" varchar NOT NULL,
  "address" varchar NOT NULL,
  "phone_number" varchar NOT NULL,
  "payment_method" varchar NOT NULL,
  "password_change_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "company_id" integer REFERENCES "companies" ("id")
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "image_link" varchar NOT NULL,
  "description" TEXT NOT NULL,
  "available_stocks" integer NOT NULL,
  "price" integer NOT NULL,
  "is_negotiable" boolean NOT NULL DEFAULT false,
  "owner_id" integer NOT NULL REFERENCES "users" ("id"),
  "company_id" integer REFERENCES "companies" ("id"),
  "likes" integer NOT NULL DEFAULT 0,
  "sold" boolean NOT NULL DEFAULT false
);

CREATE TABLE "product_likes" (
  "product_id" integer REFERENCES "products" ("id"),
  "user_id" integer REFERENCES "users" ("id"),
  "created_at" timestamptz NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("product_id", "user_id")
);