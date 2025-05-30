package api

import (
	"database/sql"
	"time"

	"github.com/gin-gonic/gin"
	db "github.com/starjardin/onja-products/db/sqlc"
	"golang.org/x/crypto/bcrypt"
)

type CreateUserRequest struct {
	Username      string `json:"username" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
	FullName      string `json:"full_name" binding:"required"`
	Address       string `json:"address" binding:"required"`
	PhoneNumber   string `json:"phone_number" binding:"required"`
	PaymentMethod string `json:"payment_method" binding:"required"`
	Password      string `json:"password" binding:"required"`
	CompanyID     int32  `json:"company_id" binding:"omitempty"`
}

type UserResponse struct {
	Username      string        `json:"username"`
	Email         string        `json:"email"`
	FullName      string        `json:"full_name"`
	Address       string        `json:"address"`
	PhoneNumber   string        `json:"phone_number"`
	PaymentMethod string        `json:"payment_method"`
	CompanyID     sql.NullInt32 `json:"company_id"`
}

func (server *Server) getUsers(ctx *gin.Context) {
	users, err := server.store.GetUsers(ctx)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, users)
}

func (server *Server) createUser(ctx *gin.Context) {
	var req CreateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	hash, _ := HashPassword(req.Password)

	arg := db.CreateUserParams{
		Username:         req.Username,
		HashedPassword:   hash,
		Email:            req.Email,
		FullName:         req.FullName,
		Address:          req.Address,
		PhoneNumber:      req.PhoneNumber,
		PaymentMethod:    req.PaymentMethod,
		PasswordChangeAt: time.Now(),
		CompanyID:        sql.NullInt32{Int32: req.CompanyID, Valid: req.CompanyID != 0},
	}

	user, err := server.store.CreateUser(ctx, arg)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	userResponse := UserResponse{
		Username:      user.Username,
		Email:         user.Email,
		FullName:      user.FullName,
		Address:       user.Address,
		PhoneNumber:   user.PhoneNumber,
		PaymentMethod: user.PaymentMethod,
		CompanyID:     user.CompanyID,
	}

	ctx.JSON(201, userResponse)
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
