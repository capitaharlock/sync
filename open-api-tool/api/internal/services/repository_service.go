package services

import (
	"api/internal/models"
	"api/internal/repository"
)

type RepositoryService struct {
	repo *repository.RepositoriesRepository
}

func NewRepositoryService(repo *repository.RepositoriesRepository) *RepositoryService {
	return &RepositoryService{repo: repo}
}

func (s *RepositoryService) GetRepositoryByModuleID(moduleID uint) (*models.Repository, error) {
	return s.repo.FindByModuleID(moduleID)
}

func (s *RepositoryService) SaveRepository(repository *models.Repository) error {
	return s.repo.Update(repository)
}

func (s *RepositoryService) DeleteRepository(moduleID uint) error {
	return s.repo.DeleteByModuleID(moduleID)
}
