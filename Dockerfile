# ============================================
# Multi-stage Dockerfile for Onja Products
# Combines: PostgreSQL + Go Backend + React Frontend
# ============================================

# Stage 1: Build Go Backend
FROM golang:1.24-alpine AS backend-builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

# Stage 2: Build React Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package.json frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile || yarn install

# Copy frontend source
COPY frontend/ .

# Build for production (use relative API path)
ENV VITE_API_URL=/query
RUN yarn build

# Stage 3: Final runtime image
FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install PostgreSQL, Nginx, Supervisor, and utilities
RUN apt-get update && apt-get install -y \
    postgresql-14 \
    postgresql-contrib-14 \
    nginx \
    supervisor \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create directories
RUN mkdir -p /app /var/log/supervisor /run/postgresql

# Copy built backend binary
COPY --from=backend-builder /app/server /app/server
COPY --from=backend-builder /app/db/migrations /app/db/migrations

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copy configuration files
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/init-db.sh /app/init-db.sh
COPY docker/start.sh /app/start.sh
COPY docker/start-backend.sh /app/start-backend.sh

# Make scripts executable
RUN chmod +x /app/init-db.sh /app/start.sh /app/start-backend.sh

# Set ownership for PostgreSQL
RUN chown -R postgres:postgres /run/postgresql

# Environment variables
ENV DB_DRIVER=postgres
ENV DB_SOURCE=postgresql://onja:onja_secret@localhost:5432/onja_products?sslmode=disable
ENV MIGRATION_URL=file:///app/db/migrations
ENV HTTP_SERVER_ADDRESS=0.0.0.0:8080
ENV TOKEN_SYMETRIC_KEY=abcdefghijklmnopqrstuvwxyz123456
ENV ACCESS_TOKEN_DURATION=15m
ENV REFRESH_TOKEN_DURATION=24h
ENV POSTGRES_USER=onja
ENV POSTGRES_PASSWORD=onja_secret
ENV POSTGRES_DB=onja_products

# Expose ports: 80 (nginx/frontend), 8080 (backend API)
EXPOSE 80 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:80/ && curl -f http://localhost:8080/query -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' || exit 1

# Start all services using supervisor
CMD ["/app/start.sh"]
