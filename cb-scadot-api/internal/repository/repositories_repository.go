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

// DeleteByModuleID deletes a repository by its associated module ID.
func (r *RepositoriesRepository) DeleteByModuleID(moduleID uint) error {
	return r.db.Where("module_id = ?", moduleID).Delete(&models.Repository{}).Error
}

// CreateOrUpdate creates or updates the repository associated with a module.
func (r *RepositoriesRepository) CreateOrUpdate(repository *models.Repository) error {
	// Fetch the existing repository
	var existingRepository models.Repository
	err := r.db.Where("module_id = ?", repository.ModuleID).First(&existingRepository).Error

	if err != nil {
		// If the repository doesn't exist, create a new one
		if err == gorm.ErrRecordNotFound {
			return r.db.Create(repository).Error
		}
		// Return other errors
		return err
	}

	// Update only non-empty fields
	if repository.RepositoryProvider != nil {
		existingRepository.RepositoryProvider = repository.RepositoryProvider
	}
	if repository.RepositoryURL != nil {
		existingRepository.RepositoryURL = repository.RepositoryURL
	}
	if repository.AccessToken != nil {
		existingRepository.AccessToken = repository.AccessToken
	}

	// Save the updated repository
	return r.db.Save(&existingRepository).Error
}
