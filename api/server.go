package api

import (
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

	server.router.GET("/users", server.getUsers)
	server.router.POST("/users/create", server.createUser)
	server.router.GET("/companies", server.getCompanies)
	server.router.POST("/companies/create", server.createCompany)

	return server, nil
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
