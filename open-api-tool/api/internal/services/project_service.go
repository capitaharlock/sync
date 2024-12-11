package services

import (
    "api/internal/models"
    "api/internal/repository"
)

type ProjectService struct {
    repo *repository.ProjectRepository
}

func NewProjectService(repo *repository.ProjectRepository) *ProjectService {
    return &ProjectService{repo: repo}
}

func (s *ProjectService) Create(project *models.Project) error {
    return s.repo.Create(project)
}

func (s *ProjectService) Get(id uint, userID uint) (*models.Project, error) {
    return s.repo.FindByID(id, userID)
}

func (s *ProjectService) List(userID uint, page, limit int) ([]models.Project, int64, error) {
    return s.repo.List(userID, page, limit)
}

func (s *ProjectService) Delete(id uint, userID uint) error {
    _, err := s.repo.FindByID(id, userID)
    if err != nil {
        return err
    }
    return s.repo.Delete(id, userID)
}
