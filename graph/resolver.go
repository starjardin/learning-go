package graph

import (
	"github.com/rs/zerolog"
	"github.com/starjardin/onja-products/services"
	"github.com/starjardin/onja-products/token"
	"github.com/starjardin/onja-products/utils"

	db "github.com/starjardin/onja-products/db/sqlc"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Store          db.Store
	TokenMaker     token.Maker
	Config         utils.Config
	Logger         zerolog.Logger
	UserService    *services.UserService
	ProductService *services.ProductService
}
