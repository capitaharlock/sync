package handlers

import (
	"api/internal/models"
	"api/internal/services"
	"net/http"
	"strconv"

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
		Name          string `json:"name" binding:"required"`
		Description   string `json:"description"`
		RepositoryURL string `json:"repository_url"`
		Status        string `json:"status" binding:"required"`
		Visibility    string `json:"visibility" binding:"required"`
		TechnologyID  uint   `json:"technology_id"`
		LanguageID    uint   `json:"language_id"`
		FrameworkID   uint   `json:"framework_id"`
		NetworkID     uint   `json:"network_id"`
		// MockSetID     uint   `json:"mock_set_id"` // Removed
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectID, _ := strconv.ParseUint(c.Param("projectId"), 10, 32)

	module := &models.Module{
		ProjectID:     uint(projectID),
		Name:          input.Name,
		Description:   input.Description,
		RepositoryURL: input.RepositoryURL,
		Status:        input.Status,
		Visibility:    input.Visibility,
		TechnologyID:  input.TechnologyID,
		LanguageID:    input.LanguageID,
		FrameworkID:   input.FrameworkID,
		NetworkID:     input.NetworkID,
		// MockSetID:     input.MockSetID, // Removed
	}

	if err := h.service.Create(module); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create module"})
		return
	}

	c.JSON(http.StatusCreated, module)
}

func (h *ModuleHandler) List(c *gin.Context) {
	// Parse project ID from the URL
	projectID, err := strconv.ParseUint(c.Param("projectId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	// Parse pagination parameters
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil || limit < 1 {
		limit = 10
	}

	// Parse optional filters from query parameters
	status := c.Query("status")
	visibility := c.Query("visibility")

	// Parse optional sorting parameters
	sortBy := c.DefaultQuery("sort_by", "date_time_created")
	sortOrder := c.DefaultQuery("sort_order", "desc")

	// Call the service to fetch modules with filters, sorting, and pagination
	modules, total, err := h.service.List(uint(projectID), page, limit, status, visibility, sortBy, sortOrder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch modules"})
		return
	}

	// Return the response with modules and pagination metadata
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
		Name          string `json:"name"`
		Description   string `json:"description"`
		RepositoryURL string `json:"repository_url"`
		Status        string `json:"status"`
		Visibility    string `json:"visibility"`
		TechnologyID  uint   `json:"technology_id"`
		LanguageID    uint   `json:"language_id"`
		FrameworkID   uint   `json:"framework_id"`
		NetworkID     uint   `json:"network_id"`
		// MockSetID     uint   `json:"mock_set_id"` // Removed
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
	// if input.MockSetID != 0 {
	//     module.MockSetID = input.MockSetID // Removed
	// }

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
