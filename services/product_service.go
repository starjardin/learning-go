package services

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/rs/zerolog"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/utils"
)

type ProductService struct {
	store  db.Store
	logger zerolog.Logger
}

func NewProductService(store db.Store, logger zerolog.Logger) *ProductService {
	return &ProductService{
		store:  store,
		logger: logger.With().Str("service", "product").Logger(),
	}
}

type CreateProductParams struct {
	Name            string
	Description     string
	Price           int
	OwnerID         int32
	CompanyID       *int
	ImageLink       string
	AvailableStocks int
	IsNegotiable    bool
	Category        string
}

// CreateProduct creates a new product with validation
func (s *ProductService) CreateProduct(ctx context.Context, params CreateProductParams) (db.Product, error) {
	s.logger.Info().Str("name", params.Name).Int32("ownerID", params.OwnerID).Msg("creating product")

	validator := utils.ProductInputValidator{
		Name:            params.Name,
		Description:     params.Description,
		Price:           params.Price,
		ImageLink:       params.ImageLink,
		AvailableStocks: params.AvailableStocks,
		Category:        params.Category,
	}
	if errs := validator.Validate(); errs.HasErrors() {
		return db.Product{}, fmt.Errorf("validation failed: %w", errs)
	}

	var companyID pgtype.Int4
	if params.CompanyID != nil {
		companyID = pgtype.Int4{Valid: true, Int32: int32(*params.CompanyID)}
	}

	product, err := s.store.CreateProduct(ctx, db.CreateProductParams{
		Name:            params.Name,
		Description:     params.Description,
		Price:           int32(params.Price),
		CreatedAt:       pgtype.Timestamptz{Time: time.Now(), Valid: true},
		UpdatedAt:       pgtype.Timestamptz{Time: time.Now(), Valid: true},
		OwnerID:         params.OwnerID,
		CompanyID:       companyID,
		ImageLink:       params.ImageLink,
		AvailableStocks: int32(params.AvailableStocks),
		IsNegotiable:    params.IsNegotiable,
		Category:        params.Category,
	})
	if err != nil {
		s.logger.Error().Err(err).Msg("failed to create product")
		return db.Product{}, fmt.Errorf("failed to create product: %w", err)
	}

	s.logger.Info().Int32("productID", product.ID).Msg("product created successfully")
	return product, nil
}

func (s *ProductService) GetProduct(ctx context.Context, id string) (db.Product, error) {
	productID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return db.Product{}, fmt.Errorf("invalid product ID: %w", err)
	}

	product, err := s.store.GetProduct(ctx, int32(productID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Product{}, fmt.Errorf("product not found")
		}
		return db.Product{}, fmt.Errorf("failed to get product: %w", err)
	}
	return product, nil
}

// GetProductsParams contains parameters for listing products
type GetProductsParams struct {
	Category     *string
	Sold         *bool
	IsNegotiable *bool
	Search       *string
}

func (s *ProductService) GetProducts(ctx context.Context, params GetProductsParams) ([]db.Product, error) {
	var categoryParam pgtype.Text
	if params.Category != nil && *params.Category != "" {
		categoryParam = pgtype.Text{String: *params.Category, Valid: true}
	}

	var soldParam pgtype.Bool
	if params.Sold != nil {
		soldParam = pgtype.Bool{Bool: *params.Sold, Valid: true}
	}

	var isNegotiableParam pgtype.Bool
	if params.IsNegotiable != nil {
		isNegotiableParam = pgtype.Bool{Bool: *params.IsNegotiable, Valid: true}
	}

	var searchParam pgtype.Text
	if params.Search != nil && *params.Search != "" {
		searchParam = pgtype.Text{String: *params.Search, Valid: true}
	}

	return s.store.GetProducts(ctx, db.GetProductsParams{
		Category:     categoryParam,
		Sold:         soldParam,
		IsNegotiable: isNegotiableParam,
		Search:       searchParam,
	})
}

// GetProductsAdvancedParams contains parameters for advanced product search
type GetProductsAdvancedParams struct {
	Search    *string
	MinPrice  *int
	MaxPrice  *int
	MinStock  *int
	Sold      *bool
	CompanyID *int
	SortBy    *string
	Limit     *int
	Offset    *int
}

// GetProductsAdvanced retrieves products with advanced filters
func (s *ProductService) GetProductsAdvanced(ctx context.Context, params GetProductsAdvancedParams) ([]db.Product, error) {
	// Set defaults
	limit := int32(20)
	offset := int32(0)
	sortBy := "created_desc"

	if params.Limit != nil {
		limit = int32(*params.Limit)
	}
	if params.Offset != nil {
		offset = int32(*params.Offset)
	}
	if params.SortBy != nil {
		sortBy = *params.SortBy
	}

	var search string
	var minPrice, maxPrice, minStock, companyID int32
	var sold bool

	if params.Search != nil {
		search = *params.Search
	}
	if params.MinPrice != nil {
		minPrice = int32(*params.MinPrice)
	}
	if params.MaxPrice != nil {
		maxPrice = int32(*params.MaxPrice)
	}
	if params.MinStock != nil {
		minStock = int32(*params.MinStock)
	}
	if params.Sold != nil {
		sold = *params.Sold
	}
	if params.CompanyID != nil {
		companyID = int32(*params.CompanyID)
	}

	return s.store.GetProductsAdvanced(ctx, db.GetProductsAdvancedParams{
		Column1: search,
		Column2: minPrice,
		Column3: maxPrice,
		Column4: minStock,
		Column5: sold,
		Column6: companyID,
		Column7: sortBy,
		Limit:   limit,
		Offset:  offset,
	})
}

// GetProductsByOwner retrieves products by owner ID
func (s *ProductService) GetProductsByOwner(ctx context.Context, ownerID string) ([]db.Product, error) {
	id, err := strconv.ParseInt(ownerID, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid owner ID: %w", err)
	}
	return s.store.GetProductsByOwner(ctx, int32(id))
}

// GetProductCount returns the count of products matching filters
func (s *ProductService) GetProductCount(ctx context.Context, params GetProductsAdvancedParams) (int64, error) {
	var search string
	var minPrice, maxPrice, minStock, companyID int32
	var sold bool

	if params.Search != nil {
		search = *params.Search
	}
	if params.MinPrice != nil {
		minPrice = int32(*params.MinPrice)
	}
	if params.MaxPrice != nil {
		maxPrice = int32(*params.MaxPrice)
	}
	if params.MinStock != nil {
		minStock = int32(*params.MinStock)
	}
	if params.Sold != nil {
		sold = *params.Sold
	}
	if params.CompanyID != nil {
		companyID = int32(*params.CompanyID)
	}

	return s.store.GetProductCount(ctx, db.GetProductCountParams{
		Column1: search,
		Column2: minPrice,
		Column3: maxPrice,
		Column4: minStock,
		Column5: sold,
		Column6: companyID,
	})
}

// DeleteProduct deletes a product by ID
func (s *ProductService) DeleteProduct(ctx context.Context, id string, ownerID int32) (db.Product, error) {
	productID, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return db.Product{}, fmt.Errorf("invalid product ID: %w", err)
	}

	// Get product to verify ownership
	product, err := s.store.GetProduct(ctx, int32(productID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return db.Product{}, fmt.Errorf("product not found")
		}
		return db.Product{}, fmt.Errorf("failed to get product: %w", err)
	}

	// Check ownership
	if product.OwnerID != ownerID {
		return db.Product{}, fmt.Errorf("unauthorized: you can only delete your own products")
	}

	deletedProduct, err := s.store.DeleteProduct(ctx, int32(productID))
	if err != nil {
		return db.Product{}, fmt.Errorf("failed to delete product: %w", err)
	}

	s.logger.Info().Int32("productID", int32(productID)).Msg("product deleted successfully")
	return deletedProduct, nil
}

// UpdateProductParams contains the input for updating a product
type UpdateProductParams struct {
	ID              string
	Name            *string
	Description     *string
	Price           *int
	ImageLink       *string
	AvailableStocks *int
	IsNegotiable    *bool
	Sold            *bool
	Category        *string
	CompanyID       *int
}

// UpdateProduct updates a product
func (s *ProductService) UpdateProduct(ctx context.Context, params UpdateProductParams) (db.Product, error) {
	productID, err := strconv.ParseInt(params.ID, 10, 64)
	if err != nil {
		return db.Product{}, fmt.Errorf("invalid product ID: %w", err)
	}

	updateParams := db.UpdateProductParams{
		ID: int32(productID),
	}

	if params.Name != nil {
		updateParams.Name = pgtype.Text{Valid: true, String: *params.Name}
	}
	if params.Description != nil {
		updateParams.Description = pgtype.Text{Valid: true, String: *params.Description}
	}
	if params.Price != nil {
		updateParams.Price = pgtype.Int4{Valid: true, Int32: int32(*params.Price)}
	}
	if params.ImageLink != nil {
		updateParams.ImageLink = pgtype.Text{Valid: true, String: *params.ImageLink}
	}
	if params.AvailableStocks != nil {
		updateParams.AvailableStocks = pgtype.Int4{Valid: true, Int32: int32(*params.AvailableStocks)}
	}
	if params.IsNegotiable != nil {
		updateParams.IsNegotiable = pgtype.Bool{Valid: true, Bool: *params.IsNegotiable}
	}
	if params.Sold != nil {
		updateParams.Sold = pgtype.Bool{Valid: true, Bool: *params.Sold}
	}
	if params.Category != nil {
		updateParams.Category = pgtype.Text{Valid: true, String: *params.Category}
	}
	if params.CompanyID != nil {
		updateParams.CompanyID = pgtype.Int4{Valid: true, Int32: int32(*params.CompanyID)}
	}

	return s.store.UpdateProduct(ctx, updateParams)
}
