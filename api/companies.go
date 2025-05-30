package api

import (
	"github.com/gin-gonic/gin"
)

type CreateCompanyRequest struct {
	Name string `json:"name" binding:"required"`
}

func (server *Server) getCompanies(ctx *gin.Context) {
	companies, err := server.store.GetCompanies(ctx)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, companies)
}

func (server *Server) createCompany(ctx *gin.Context) {
	var req CreateCompanyRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	arg := req.Name

	company, err := server.store.CreateCompany(ctx, arg)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, company)
}
