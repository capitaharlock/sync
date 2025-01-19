package services

import (
	"api/internal/models"
	"api/internal/repository"
)

type ModuleService struct {
	repo *repository.ModuleRepository
}

func NewModuleService(repo *repository.ModuleRepository) *ModuleService {
	return &ModuleService{repo: repo}
}

func (s *ModuleService) Create(module *models.Module) error {
	return s.repo.Create(module)
}

func (s *ModuleService) Get(id, projectID uint) (*models.Module, error) {
	return s.repo.FindByID(id, projectID)
}

func (s *ModuleService) List(projectID uint, page, limit int, status, visibility, sortBy, sortOrder string) ([]models.Module, int64, error) {
	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	// Call the repository to fetch modules with filters, sorting, and pagination
	modules, total, err := s.repo.List(projectID, page, limit, status, visibility, sortBy, sortOrder)
	if err != nil {
		return nil, 0, err
	}

	return modules, total, nil
}

func (s *ModuleService) Update(module *models.Module) error {
	return s.repo.Update(module)
}

func (s *ModuleService) Delete(id, projectID uint) error {
	return s.repo.Delete(id, projectID)
}
