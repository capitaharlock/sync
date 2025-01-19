// internal/handlers/repository_handler.go
package handlers

import (
	"api/internal/models"
	"api/internal/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RepositoryHandler struct {
	service *services.RepositoryService
}

func NewRepositoryHandler(service *services.RepositoryService) *RepositoryHandler {
	return &RepositoryHandler{service: service}
}

func (h *RepositoryHandler) GetRepository(c *gin.Context) {
	moduleID := c.Param("moduleId")
	var id uint
	if _, err := fmt.Sscanf(moduleID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid module ID"})
		return
	}

	repository, err := h.service.GetRepositoryByModuleID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, repository)
}

func (h *RepositoryHandler) SaveRepository(c *gin.Context) {
	moduleID := c.Param("moduleId")
	var id uint
	if _, err := fmt.Sscanf(moduleID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid module ID"})
		return
	}

	var repository models.Repository
	if err := c.ShouldBindJSON(&repository); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	repository.ModuleID = id
	if err := h.service.SaveRepository(&repository); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, repository)
}

func (h *RepositoryHandler) DeleteRepository(c *gin.Context) {
	moduleID := c.Param("moduleId")
	var id uint
	if _, err := fmt.Sscanf(moduleID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid module ID"})
		return
	}

	if err := h.service.DeleteRepository(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
