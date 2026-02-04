package services

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/rs/zerolog"
	db "github.com/starjardin/onja-products/db/sqlc"
	"github.com/starjardin/onja-products/graph/model"
)

// CompanyService handles company-related business logic
type CompanyService struct {
	store  db.Store
	logger zerolog.Logger
}

// NewCompanyService creates a new CompanyService
func NewCompanyService(store db.Store, logger zerolog.Logger) *CompanyService {
	return &CompanyService{
		store:  store,
		logger: logger.With().Str("service", "company").Logger(),
	}
}

// CreateUserParams contains the input for creating a company
type CreateCompanyParams struct {
	Name string
}

type UpdateCompanyParams struct {
	CompanyID int32
	Name      string
}

// CreateCompanyResult contains the result of company creation
type CreateCompanyResult struct {
	Company db.Company
	Message string
}

// CreateCompany creates a new company
func (s *CompanyService) CreateCompany(ctx context.Context, params CreateCompanyParams) (*CreateCompanyResult, error) {
	s.logger.Info().Str("name", params.Name).Msg("creating new company")

	company, err := s.store.CreateCompany(ctx, params.Name)
	if err != nil {
		return nil, fmt.Errorf("failed to create company: %w", err)
	}
	return &CreateCompanyResult{
		Company: company,
		Message: "company created successfully",
	}, nil
}

func (s *CompanyService) UpdateCompany(ctx context.Context, params UpdateCompanyParams) (*model.Company, error) {
	s.logger.Info().Int32("companyID", params.CompanyID).Str("name", params.Name).Msg("updating company")

	company, err := s.store.UpdateCompany(ctx, db.UpdateCompanyParams{
		ID:   params.CompanyID,
		Name: params.Name,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update company: %w", err)
	}
	return &model.Company{
		ID:   fmt.Sprintf("%d", company.ID),
		Name: company.Name,
	}, nil
}

func (s *CompanyService) GetCompanies(ctx context.Context) ([]*model.Company, error) {
	s.logger.Info().Msg("fetching companies")

	companies, err := s.store.GetCompanies(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get companies: %w", err)
	}

	var result []*model.Company
	for _, company := range companies {
		result = append(result, &model.Company{
			ID:   fmt.Sprintf("%d", company.ID),
			Name: company.Name,
		})
	}

	return result, nil
}

func (s *CompanyService) GetCompanyByID(ctx context.Context, companyID string) (*model.Company, error) {
	companyIDInt, err := strconv.ParseInt(companyID, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid company ID: %w", err)
	}

	company, err := s.store.GetCompany(ctx, int32(companyIDInt))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("company not found")
		}
		return nil, fmt.Errorf("failed to get company: %w", err)
	}

	return &model.Company{
		ID:   fmt.Sprintf("%d", company.ID),
		Name: company.Name,
	}, nil
}
