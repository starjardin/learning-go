package graph

import (
	"github.com/starjardin/onja-products/token"

	db "github.com/starjardin/onja-products/db/sqlc"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB         *db.Store
	Queries    *db.Queries
	TokenMaker token.Maker
}
