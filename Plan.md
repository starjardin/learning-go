## Product

# Product perspective

#### High level description

This product is an e-comerce product where users and buyers meet together to get a straight deal without the need of middlemen.

## What you can do

### As a sales person:
- You can have an account and upload your products straight in this platform
- You can delete product feed from the platform that are not available anymore

### As a buyer:
- You can purchase your product from the UI and then contact the sales people to send them over to you. Products will be handed to you in a few moment.

## What you can't do

### As a buyer:
- You can't expect to recieve your product right away, it may take some time.

### As a sales person
- Your image is stored via url, we still don't have a storage for binary data as of now (This feature will be looked in very near future)

- We still dont support multi-factor authentification

# Technical perspective

### Data structure

1. harvest:
    - id SERIAL PRIMARY KEY,
    - name VARCHAR(255) NOT NULL,
    - image_link VARCHAR(500) NOT NULL,
    - description TEXT NOT NULL,
    - available_stocks INTEGER NOT NULL CHECK (available_stocks >= 0),
    - price INTEGER NOT NULL CHECK (price > 0),
    - is_negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    - owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    - company_id INTEGER REFERENCES companies(id),
    - likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    - sold BOOLEAN NOT NULL DEFAULT FALSE,
    - created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    - updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
1. user:
    - id SERIAL PRIMARY KEY,
    - email VARCHAR(255) UNIQUE NOT NULL,
    - username VARCHAR(50) UNIQUE NOT NULL,
    - hashed_password VARCHAR(255) NOT NULL,
    - full_name VARCHAR(200) NOT NULL,
    - phone_number VARCHAR(20),
    - address VARCHAR(500),
    - payment_method VARCHAR(50) array,
    - is_verified BOOLEAN DEFAULT FALSE,
    - is_active BOOLEAN DEFAULT TRUE,
    - company_id INTEGER REFERENCES companies(id) array,
    - password_changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    - created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    - updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    - last_login_at TIMESTAMPTZ
1. company
    - id SERIAL PRIMARY KEY,
    - name VARCHAR(255) UNIQUE NOT NULL,
    - created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    - updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

# User Flow

## Sign up flow
1. Fields to fill (username, full name, phone number, address, payment method, email, companies, password, confirmation password)

1. User submits email + password on FE.
1. BE validates → hashes password → saves user (with email_verified: false).
1. BE generates a verification token, stores it with expiry.
1. BE sends email with link: https://yoursite.com/verify?token=abc123
1. User clicks link → BE validates token → marks email_verified = true.
1. Redirect to login page: “Email confirmed! Please sign in.”
🔹 Login
1. User enters email + password.
1. BE checks:
1. Does user exist?
1. Is password correct (via hash comparison)?
(Optional) Is email verified? (You can require this or allow limited access before verification)
1. If valid → issue a session cookie or JWT → user is logged in.

## Sign in flow
1. Fields to fill (username, email, password)
1. User sends request from FE
1. BE checks if all fields are valid
1. If all valid
    - Loggin user
    - Update token
1. If not valid
    - Return error