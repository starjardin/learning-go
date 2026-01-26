#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
until pg_isready -h localhost -p 5432 -U postgres; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Check if database exists
DB_EXISTS=$(su - postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='onja_products'\"")

if [ "$DB_EXISTS" != "1" ]; then
    echo "Creating database and user..."
    
    # Create user and database
    su - postgres -c "psql -c \"CREATE USER onja WITH PASSWORD 'onja_secret';\""
    su - postgres -c "psql -c \"CREATE DATABASE onja_products OWNER onja;\""
    su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE onja_products TO onja;\""
    
    echo "Database and user created!"
    
    # Run migrations
    echo "Running migrations..."
    for migration in /app/db/migrations/*.up.sql; do
        echo "Applying migration: $migration"
        PGPASSWORD=onja_secret psql -h localhost -U onja -d onja_products -f "$migration"
    done
    echo "Migrations completed!"
else
    echo "Database already exists, skipping initialization."
fi

echo "Database initialization complete!"
