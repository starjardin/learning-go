postgres:
	docker run --name onja_products_db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:17-alpine

createdb:
	docker exec -it onja_products_db createdb --username=root --owner=root onja_products

dropdb:
	docker exec -it onja_products_db dropdb onja_products

migrateup:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose up

migrateup1:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose up 1

migratedown:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose down

migratedown1:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose down 1

new_migration:
	migrate create -ext sql -dir db/migrations -seq $(name)

test:
	go test -v -cover ./...

sqlc:
	sqlc generate

gqlgen:
	go mod tidy
	GOPROXY=direct go get -u github.com/99designs/gqlgen
	GOPROXY=direct go get -u github.com/99designs/gqlgen/codegen/config
	GOPROXY=direct go get -u github.com/99designs/gqlgen/internal/imports
	GOPROXY=direct go get -u github.com/99designs/gqlgen/api
	GOPROXY=direct go get -u github.com/urfave/cli/v2
	go run github.com/99designs/gqlgen generate

server:
	go run main.go

start:
	docker start onja_products_db || docker run --name onja_products_db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:17-alpine
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	docker exec -it onja_products_db createdb --username=root --owner=root onja_products 2>/dev/null || true
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose up

mock:
	mockgen -package mockdb --destination db/mock/store.go github.com/starjardin/onja-products/db/sqlc Store


.PHONY: postgres createdb dropdb migrateup migratedown migrateup1 migratedown1 sqlc test server mock gqlgen new_migration