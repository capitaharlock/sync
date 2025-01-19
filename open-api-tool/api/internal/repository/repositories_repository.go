package repository

import (
	"api/internal/models"

	"gorm.io/gorm"
)

type RepositoriesRepository struct {
	db *gorm.DB
}

func NewRepositoriesRepository(db *gorm.DB) *RepositoriesRepository {
	return &RepositoriesRepository{db: db}
}

// Create creates a new repository record in the database.
func (r *RepositoriesRepository) Create(repository *models.Repository) error {
	return r.db.Create(repository).Error
}

// FindByModuleID finds a repository by its associated module ID.
func (r *RepositoriesRepository) FindByModuleID(moduleID uint) (*models.Repository, error) {
	var repository models.Repository
	err := r.db.Where("module_id = ?", moduleID).First(&repository).Error
	return &repository, err
}

// Update updates an existing repository record in the database.
func (r *RepositoriesRepository) Update(repository *models.Repository) error {
	return r.db.Save(repository).Error
}

// DeleteByModuleID deletes a repository by its associated module ID.
func (r *RepositoriesRepository) DeleteByModuleID(moduleID uint) error {
	return r.db.Where("module_id = ?", moduleID).Delete(&models.Repository{}).Error
}
