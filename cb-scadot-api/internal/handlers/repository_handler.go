package handlers

import (
	"api/internal/services"
	"fmt"
	"net/http"
	"strconv"

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
	moduleID, _ := strconv.ParseUint(c.Param("moduleId"), 10, 32)

	var input struct {
		RepositoryProvider *string `json:"repository_provider"`
		RepositoryURL      *string `json:"repository_url"`
		AccessToken        *string `json:"access_token"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch the existing repository
	existingRepository, err := h.service.GetRepositoryByModuleID(uint(moduleID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Repository not found"})
		return
	}

	// Update only non-empty fields
	if input.RepositoryProvider != nil {
		existingRepository.RepositoryProvider = input.RepositoryProvider
	}
	if input.RepositoryURL != nil {
		existingRepository.RepositoryURL = input.RepositoryURL
	}
	if input.AccessToken != nil {
		existingRepository.AccessToken = input.AccessToken
	}

	// Save the updated repository
	if err := h.service.SaveRepository(existingRepository); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save repository"})
		return
	}

	c.JSON(http.StatusOK, existingRepository)
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

func (h *RepositoryHandler) SyncRepository(c *gin.Context) {
	moduleID, _ := strconv.ParseUint(c.Param("moduleId"), 10, 32)

	// Call the service to sync the repository
	if err := h.service.SyncRepository(uint(moduleID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Repository synchronized successfully"})
}
