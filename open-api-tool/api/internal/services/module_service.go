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

func (s *ModuleService) Update(module *models.Module) error {
    return s.repo.Update(module)
}

func (s *ModuleService) Delete(id, projectID uint) error {
    return s.repo.Delete(id, projectID)
}

func (s *ModuleService) List(projectID uint, page, limit int) ([]models.Module, int64, error) {
    return s.repo.List(projectID, page, limit)
}
