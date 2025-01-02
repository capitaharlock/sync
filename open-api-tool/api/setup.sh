#!/bin/bash

# Update module_handler.go
cat << 'EOF' > internal/handlers/module_handler.go
package handlers

import (
    "net/http"
    "strconv"
    "api/internal/models"
    "api/internal/services"
    "github.com/gin-gonic/gin"
)

type ModuleHandler struct {
    service *services.ModuleService
}

func NewModuleHandler(service *services.ModuleService) *ModuleHandler {
    return &ModuleHandler{service: service}
}

func (h *ModuleHandler) Create(c *gin.Context) {
    var input struct {
        Name           string `json:"name" binding:"required"`
        Description    string `json:"description"`
        RepositoryURL  string `json:"repository_url"`
        Status        string `json:"status" binding:"required"`
        Visibility    string `json:"visibility" binding:"required"`
        TechnologyID  uint   `json:"technology_id"`
        LanguageID    uint   `json:"language_id"`
        FrameworkID   uint   `json:"framework_id"`
        NetworkID     uint   `json:"network_id"`
        MockSetID     uint   `json:"mock_set_id"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    projectID, _ := strconv.ParseUint(c.Param("projectId"), 10, 32)

    module := &models.Module{
        ProjectID:     uint(projectID),
        Name:         input.Name,
        Description:  input.Description,
        RepositoryURL: input.RepositoryURL,
        Status:       input.Status,
        Visibility:   input.Visibility,
        TechnologyID: input.TechnologyID,
        LanguageID:   input.LanguageID,
        FrameworkID:  input.FrameworkID,
        NetworkID:    input.NetworkID,
        MockSetID:    input.MockSetID,
    }

    if err := h.service.Create(module); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create module"})
        return
    }

    c.JSON(http.StatusCreated, module)
}

func (h *ModuleHandler) List(c *gin.Context) {
    projectID, _ := strconv.ParseUint(c.Param("projectId"), 10, 32)
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

    modules, total, err := h.service.List(uint(projectID), page, limit)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch modules"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "data": modules,
        "meta": gin.H{
            "total": total,
            "page":  page,
            "limit": limit,
        },
    })
}

func (h *ModuleHandler) Get(c *gin.Context) {
    projectID, _ := strconv.ParseUint(c.Param("projectId"), 10, 32)
    moduleID, _ := strconv.ParseUint(c.Param("moduleId"), 10, 32)

    module, err := h.service.Get(uint(moduleID), uint(projectID))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
        return
    }

    c.JSON(http.StatusOK, module)
}

func (h *ModuleHandler) Update(c *gin.Context) {
    projectID, _ := strconv.ParseUint(c.Param("projectId"), 10, 32)
    moduleID, _ := strconv.ParseUint(c.Param("moduleId"), 10, 32)

    var input struct {
        Name           string `json:"name"`
        Description    string `json:"description"`
        RepositoryURL  string `json:"repository_url"`
        Status        string `json:"status"`
        Visibility    string `json:"visibility"`
        TechnologyID  uint   `json:"technology_id"`
        LanguageID    uint   `json:"language_id"`
        FrameworkID   uint   `json:"framework_id"`
        NetworkID     uint   `json:"network_id"`
        MockSetID     uint   `json:"mock_set_id"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    module, err := h.service.Get(uint(moduleID), uint(projectID))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
        return
    }

    if input.Name != "" {
        module.Name = input.Name
    }
    if input.Description != "" {
        module.Description = input.Description
    }
    if input.RepositoryURL != "" {
        module.RepositoryURL = input.RepositoryURL
    }
    if input.Status != "" {
        module.Status = input.Status
    }
    if input.Visibility != "" {
        module.Visibility = input.Visibility
    }
    if input.TechnologyID != 0 {
        module.TechnologyID = input.TechnologyID
    }
    if input.LanguageID != 0 {
        module.LanguageID = input.LanguageID
    }
    if input.FrameworkID != 0 {
        module.FrameworkID = input.FrameworkID
    }
    if input.NetworkID != 0 {
        module.NetworkID = input.NetworkID
    }
    if input.MockSetID != 0 {
        module.MockSetID = input.MockSetID
    }

    if err := h.service.Update(module); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update module"})
        return
    }

    c.JSON(http.StatusOK, module)
}

func (h *ModuleHandler) Delete(c *gin.Context) {
    projectID, _ := strconv.ParseUint(c.Param("projectId"), 10, 32)
    moduleID, _ := strconv.ParseUint(c.Param("moduleId"), 10, 32)

    if err := h.service.Delete(uint(moduleID), uint(projectID)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Module not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Module deleted successfully"})
}
EOF

# Update module_service.go
cat << 'EOF' > internal/services/module_service.go
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

func (s *ModuleService) List(projectID uint, page, limit int) ([]models.Module, int64, error) {
    return s.repo.List(projectID, page, limit)
}

func (s *ModuleService) Update(module *models.Module) error {
    return s.repo.Update(module)
}

func (s *ModuleService) Delete(id, projectID uint) error {
    return s.repo.Delete(id, projectID)
}
EOF

# Update module_repository.go
cat << 'EOF' > internal/repository/module_repository.go
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
EOF

# Update main.go
cat << 'EOF' > main.go
package main

import (
    "api/internal/config"
    "api/internal/handlers"
    "api/internal/middleware"
    "api/internal/repository"
    "api/internal/services"
    "api/pkg/database"
    "api/pkg/database/migrations"
    "flag"
    "log"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
    migrate := flag.Bool("migrate", false, "Run database migrations")
    seed := flag.Bool("seed", false, "Seed database with initial data")
    flag.Parse()

    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }

    db, err := database.NewPostgresDB(cfg.Database)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }

    if *migrate || *seed {
        if *migrate {
            log.Println("Running migrations...")
            if err := migrations.RunMigrations(db); err != nil {
                log.Fatalf("Failed to run migrations: %v", err)
            }
        }
        if *seed {
            log.Println("Seeding database...")
            if err := migrations.SeedData(db); err != nil {
                log.Fatalf("Failed to seed database: %v", err)
            }
        }
        return
    }

    userRepo := repository.NewUserRepository(db)
    projectRepo := repository.NewProjectRepository(db)
    moduleRepo := repository.NewModuleRepository(db)

    userService := services.NewUserService(userRepo, cfg.JWTSecret)
    projectService := services.NewProjectService(projectRepo)
    moduleService := services.NewModuleService(moduleRepo)

    userHandler := handlers.NewUserHandler(userService)
    projectHandler := handlers.NewProjectHandler(projectService)
    moduleHandler := handlers.NewModuleHandler(moduleService)

    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    r.Use(middleware.ErrorHandler())

    r.POST("/register", userHandler.Register)
    r.POST("/login", userHandler.Login)
    r.POST("/recover-password", userHandler.RecoverPassword)

    auth := r.Group("/")
    auth.Use(middleware.AuthMiddleware(cfg.JWTSecret))
    {
        projects := auth.Group("/projects")
        {
            projects.POST("", projectHandler.Create)
            projects.GET("", projectHandler.List)
            projects.GET("/:projectId", projectHandler.Get)
            projects.PUT("/:projectId", projectHandler.Update)
            projects.DELETE("/:projectId", projectHandler.Delete)

            modules := projects.Group("/:projectId/modules")
            {
                modules.POST("", moduleHandler.Create)
                modules.GET("", moduleHandler.List)
                modules.GET("/:moduleId", moduleHandler.Get)
                modules.PUT("/:moduleId", moduleHandler.Update)
                modules.DELETE("/:moduleId", moduleHandler.Delete)
            }
        }
    }

    log.Printf("Server starting on %s", cfg.ServerAddress)
    if err := r.Run(cfg.ServerAddress); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
EOF

echo "Setup completed successfully."