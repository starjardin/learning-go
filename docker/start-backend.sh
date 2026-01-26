#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Backend: Waiting for PostgreSQL..."
sleep 10

until pg_isready -h localhost -p 5432 -U onja -d onja_products; do
    echo "Backend: PostgreSQL not ready, waiting..."
    sleep 2
done

echo "Backend: PostgreSQL is ready, starting server..."

# Export environment variables
export DB_DRIVER="postgres"
export DB_SOURCE="postgresql://onja:onja_secret@localhost:5432/onja_products?sslmode=disable"
export HTTP_SERVER_ADDRESS="0.0.0.0:8080"
export TOKEN_SYMETRIC_KEY="12345678901234567890123456789012"
export ACCESS_TOKEN_DURATION="15m"
export REFRESH_TOKEN_DURATION="24h"

echo "Backend: TOKEN_SYMETRIC_KEY length: ${#TOKEN_SYMETRIC_KEY}"

# Start the server
exec /app/server
