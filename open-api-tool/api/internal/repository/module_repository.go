package repository

import (
    "api/internal/models"
    "gorm.io/gorm"
)

type ModuleRepository struct {
    db *gorm.DB
}

func NewModuleRepository(db *gorm.DB) *ModuleRepository {
    return &ModuleRepository{db: db}
}

func (r *ModuleRepository) Create(module *models.Module) error {
    return r.db.Create(module).Error
}

func (r *ModuleRepository) FindByID(id uint, projectID uint) (*models.Module, error) {
    var module models.Module
    err := r.db.Preload("Project").Preload("Technology").Preload("Language").
           Preload("Framework").Preload("Network").Preload("MockSet").
           Where("id = ? AND project_id = ?", id, projectID).First(&module).Error
    return &module, err
}

func (r *ModuleRepository) List(projectID uint, page, limit int) ([]models.Module, int64, error) {
    var modules []models.Module
    var total int64
    offset := (page - 1) * limit

    err := r.db.Model(&models.Module{}).Where("project_id = ?", projectID).Count(&total).Error
    if err != nil {
        return nil, 0, err
    }

    err = r.db.Preload("Project").Preload("Technology").Preload("Language").
          Preload("Framework").Preload("Network").Preload("MockSet").
          Where("project_id = ?", projectID).
          Offset(offset).Limit(limit).Find(&modules).Error
    
    return modules, total, err
}

func (r *ModuleRepository) Update(module *models.Module) error {
    return r.db.Save(module).Error
}

func (r *ModuleRepository) Delete(id uint, projectID uint) error {
    return r.db.Where("id = ? AND project_id = ?", id, projectID).Delete(&models.Module{}).Error
}
