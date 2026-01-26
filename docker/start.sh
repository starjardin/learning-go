#!/bin/bash
set -e

echo "============================================"
echo "Starting Onja Products Application"
echo "============================================"

# PostgreSQL data directory
PGDATA="/var/lib/postgresql/data"

# Create and set permissions for PostgreSQL directories
echo "Setting up PostgreSQL directories..."
mkdir -p "$PGDATA"
mkdir -p /var/run/postgresql
mkdir -p /var/log/postgresql
chown -R postgres:postgres "$PGDATA"
chown -R postgres:postgres /var/run/postgresql
chown -R postgres:postgres /var/log/postgresql
chmod 700 "$PGDATA"

# Initialize PostgreSQL if not already initialized
if [ ! -f "$PGDATA/PG_VERSION" ]; then
    echo "Initializing PostgreSQL database..."
    su - postgres -c "/usr/lib/postgresql/14/bin/initdb -D $PGDATA"
    
    # Configure PostgreSQL for local connections
    echo "Configuring PostgreSQL..."
    echo "host all all 127.0.0.1/32 md5" >> "$PGDATA/pg_hba.conf"
    echo "host all all ::1/128 md5" >> "$PGDATA/pg_hba.conf"
    echo "local all all trust" >> "$PGDATA/pg_hba.conf"
    
    # Update postgresql.conf for listening
    echo "listen_addresses = 'localhost'" >> "$PGDATA/postgresql.conf"
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
su - postgres -c "/usr/lib/postgresql/14/bin/pg_ctl -D $PGDATA -l /var/log/postgresql/postgresql.log start"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until su - postgres -c "pg_isready -h localhost"; do
    sleep 1
done
echo "PostgreSQL is ready!"

# Initialize database and run migrations
/app/init-db.sh

# Stop PostgreSQL (supervisor will manage it)
echo "Stopping PostgreSQL for supervisor handoff..."
su - postgres -c "/usr/lib/postgresql/14/bin/pg_ctl -D $PGDATA stop"

# Wait for PostgreSQL to stop
sleep 2

echo "Starting all services with Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
