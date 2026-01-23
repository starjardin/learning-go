package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/graph"
	"github.com/starjardin/onja-products/token"
	"github.com/starjardin/onja-products/utils"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

// corsMiddleware allows all origins, methods, and headers
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// authMiddleware validates JWT token and adds user context to GraphQL requests
func authMiddleware(tokenMaker token.Maker, queries *db.Queries) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// For GraphQL endpoint, we'll handle auth in resolvers
			if strings.HasPrefix(r.URL.Path, "/query") {
				// Add token maker and queries to context for GraphQL resolvers
				ctx := context.WithValue(r.Context(), "tokenMaker", tokenMaker)
				ctx = context.WithValue(ctx, "queries", queries)
				// Pass Authorization header to context for resolvers
				ctx = context.WithValue(ctx, "Authorization", r.Header.Get("Authorization"))
				r = r.WithContext(ctx)
			}
			next.ServeHTTP(w, r)
		})
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	config, err := utils.LoadConfig(".")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	tokenMaker, err := token.NewPasetoMaker(config.TokenSymetricKey)
	if err != nil {
		log.Fatal("cannot create token maker:", err)
	}

	connPool, err := pgxpool.New(context.Background(), config.DBSource)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer connPool.Close()
	store := db.NewStore(connPool)
	queries := db.New(connPool)

	resolver := &graph.Resolver{
		DB:         &store,
		Queries:    queries,
		TokenMaker: tokenMaker,
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	// Apply middleware chain
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", corsMiddleware(authMiddleware(tokenMaker, queries)(srv)))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
