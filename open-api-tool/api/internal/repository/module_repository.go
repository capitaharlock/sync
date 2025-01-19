package repository

import (
	"api/internal/models"
	"fmt"

	"gorm.io/gorm"
)

type ModuleRepository struct {
	db *gorm.DB
}

func NewModuleRepository(db *gorm.DB) *ModuleRepository {
	return &ModuleRepository{db: db}
}

func (r *ModuleRepository) Create(module *models.Module) error {
	// Validate foreign keys (excluding mock_set_id for now)
	if err := r.db.First(&models.Technology{}, module.TechnologyID).Error; err != nil {
		return fmt.Errorf("invalid technology_id: %v", err)
	}
	if err := r.db.First(&models.Language{}, module.LanguageID).Error; err != nil {
		return fmt.Errorf("invalid language_id: %v", err)
	}
	if err := r.db.First(&models.Framework{}, module.FrameworkID).Error; err != nil {
		return fmt.Errorf("invalid framework_id: %v", err)
	}
	if err := r.db.First(&models.Network{}, module.NetworkID).Error; err != nil {
		return fmt.Errorf("invalid network_id: %v", err)
	}

	// Insert the module
	return r.db.Create(module).Error
}

func (r *ModuleRepository) FindByID(id uint, projectID uint) (*models.Module, error) {
	var module models.Module
	err := r.db.Preload("Project").
		Preload("Technology").
		Preload("Language").
		Preload("Framework").
		Preload("Network").
		// Preload("MockSet"). // Commented out for now
		Where("id = ? AND project_id = ?", id, projectID).
		First(&module).Error
	return &module, err
}

func (r *ModuleRepository) List(projectID uint, page, limit int, status, visibility, sortBy, sortOrder string) ([]models.Module, int64, error) {
	var modules []models.Module
	var total int64

	offset := (page - 1) * limit

	// Build the base query with project ID
	query := r.db.Model(&models.Module{}).Where("project_id = ?", projectID)

	// Apply optional filters
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if visibility != "" {
		query = query.Where("visibility = ?", visibility)
	}

	// Count total modules matching the filters
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply sorting
	if sortBy != "" {
		if sortOrder == "" {
			sortOrder = "desc" // Default to descending order if not specified
		}
		sortQuery := fmt.Sprintf("%s %s", sortBy, sortOrder)
		query = query.Order(sortQuery)
	}

	// Fetch modules with pagination and preload related entities
	err := query.Preload("Project").
		Preload("Technology").
		Preload("Language").
		Preload("Framework").
		Preload("Network").
		// Preload("MockSet"). // Commented out for now
		Offset(offset).
		Limit(limit).
		Find(&modules).Error

	if err != nil {
		return nil, 0, err
	}

	return modules, total, nil
}

func (r *ModuleRepository) Update(module *models.Module) error {
	return r.db.Save(module).Error
}

func (r *ModuleRepository) Delete(id uint, projectID uint) error {
	return r.db.Where("id = ? AND project_id = ?", id, projectID).Delete(&models.Module{}).Error
}
