postgres:
	docker run --name onja_products_db -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:17-alpine

createdb:
	docker exec -it onja_products_db createdb --username=root --owner=root onja_products

dropdb:
	docker exec -it postgres17 dropdb onja_products

migrateup:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5433/onja_products?sslmode=disable" -verbose up

migrateup1:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose up 1

migratedown:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose down

migratedown1:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5432/onja_products?sslmode=disable" -verbose down 1

test:
	go test -v -cover ./...

sqlc:
	sqlc generate

server:
	go run main.go

mock:
	mockgen -package mockdb --destination db/mock/store.go github.com/starjardin/onja-products/db/sqlc Store


.PHONY: postgres createdb dropdb migrateup migratedown migrateup1 migratedown1 sqlc test server mock