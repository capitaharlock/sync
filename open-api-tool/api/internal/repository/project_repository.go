package repository

import (
    "api/internal/models"
    "gorm.io/gorm"
)

type ProjectRepository struct {
    db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
    return &ProjectRepository{db: db}
}

func (r *ProjectRepository) Create(project *models.Project) error {
    return r.db.Create(project).Error
}

func (r *ProjectRepository) FindByID(id uint, userID uint) (*models.Project, error) {
    var project models.Project
    err := r.db.Preload("User").Where("id = ? AND user_id = ?", id, userID).First(&project).Error
    return &project, err
}

func (r *ProjectRepository) List(userID uint, page, limit int) ([]models.Project, int64, error) {
    var projects []models.Project
    var total int64
    offset := (page - 1) * limit

    err := r.db.Model(&models.Project{}).Where("user_id = ?", userID).Count(&total).Error
    if err != nil {
        return nil, 0, err
    }

    err = r.db.Preload("User").Where("user_id = ?", userID).
        Offset(offset).Limit(limit).Find(&projects).Error
    return projects, total, err
}

func (r *ProjectRepository) Delete(id uint, userID uint) error {
    return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Project{}).Error
}
