package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/utils"
)

type Server struct {
	store  db.Store
	router *gin.Engine
	config utils.Config
}

func NewServer(config utils.Config, store db.Store) (*Server, error) {

	server := &Server{
		store:  store,
		router: gin.Default(),
		config: config,
	}

	server.router.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "Hello, World! Welcome to Onja Products API!"})
	})

	return server, nil
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
