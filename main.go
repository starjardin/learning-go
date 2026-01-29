package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/graph"
	"github.com/starjardin/onja-products/logger"
	"github.com/starjardin/onja-products/middleware"
	"github.com/starjardin/onja-products/services"
	"github.com/starjardin/onja-products/token"
	"github.com/starjardin/onja-products/utils"
	"github.com/vektah/gqlparser/v2/ast"
	"golang.org/x/time/rate"
)

const defaultPort = "8080"

// authMiddleware validates JWT token and adds user context to GraphQL requests
func authMiddleware(tokenMaker token.Maker, store db.Store) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// For GraphQL endpoint, validate token and set auth context
			if strings.HasPrefix(r.URL.Path, "/query") {
				ctx := r.Context()

				// Add token maker to context for GraphQL resolvers
				ctx = context.WithValue(ctx, "tokenMaker", tokenMaker)

				// Try to extract and validate the token
				authHeader := r.Header.Get("Authorization")
				if authHeader != "" {
					fields := strings.Fields(authHeader)
					if len(fields) == 2 && fields[0] == "Bearer" {
						tokenStr := fields[1]
						payload, err := tokenMaker.VerifyToken(tokenStr)
						if err == nil {
							// Token is valid, get user from database
							user, err := store.GetUserByUsername(ctx, payload.Username)
							if err == nil {
								// Set the auth context using the graph package function
								ctx = graph.SetAuthContext(ctx, int64(user.ID), user.Username, payload.Role)
							}
						}
					}
				}

				r = r.WithContext(ctx)
			}
			next.ServeHTTP(w, r)
		})
	}
}

func main() {
	// Load configuration
	config, err := utils.LoadConfig(".")
	if err != nil {
		fmt.Fprintf(os.Stderr, "cannot load config: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	log := logger.New(config.Environment)
	log.Info().Str("environment", config.Environment).Msg("starting server")

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Create token maker
	tokenMaker, err := token.NewPasetoMaker(config.TokenSymetricKey)
	if err != nil {
		log.Fatal().Err(err).Msg("cannot create token maker")
	}

	// Connect to database
	connPool, err := pgxpool.New(context.Background(), config.DBSource)
	if err != nil {
		log.Fatal().Err(err).Msg("unable to connect to database")
	}
	defer connPool.Close()

	// Verify database connection
	if err := connPool.Ping(context.Background()); err != nil {
		log.Fatal().Err(err).Msg("unable to ping database")
	}
	log.Info().Msg("connected to database")

	// Initialize store and services
	store := db.NewStore(connPool)
	userService := services.NewUserService(store, tokenMaker, config, log)
	productService := services.NewProductService(store, log)

	// Create resolver
	resolver := &graph.Resolver{
		Store:          store,
		TokenMaker:     tokenMaker,
		Config:         config,
		Logger:         log,
		UserService:    userService,
		ProductService: productService,
	}

	// Create GraphQL handler
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	// Initialize rate limiter
	rateLimiter := middleware.NewRateLimiter(
		rate.Limit(config.RateLimitRPS),
		config.RateLimitBurst,
		log,
	)

	// Setup HTTP mux
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if err := connPool.Ping(r.Context()); err != nil {
			w.WriteHeader(http.StatusServiceUnavailable)
			json.NewEncoder(w).Encode(map[string]string{"status": "unhealthy", "error": err.Error()})
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
	})

	// GraphQL playground
	mux.Handle("/", playground.Handler("GraphQL playground", "/query"))

	// GraphQL endpoint with middleware chain
	graphqlHandler := middleware.CORS(middleware.DefaultCORSConfig())(
		authMiddleware(tokenMaker, store)(srv),
	)
	mux.Handle("/query", graphqlHandler)

	// Apply global middleware
	var httpHandler http.Handler = mux
	httpHandler = rateLimiter.Limit(httpHandler)
	httpHandler = middleware.RequestLogger(log)(httpHandler)

	// Create HTTP server
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      httpHandler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Info().Str("port", port).Msg("starting HTTP server")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("server error")
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info().Msg("shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal().Err(err).Msg("server forced to shutdown")
	}

	log.Info().Msg("server stopped gracefully")
}
