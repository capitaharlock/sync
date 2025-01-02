package handlers

import (
	"api/internal/models"
	"api/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
    service *services.ProjectService
}

func NewProjectHandler(service *services.ProjectService) *ProjectHandler {
    return &ProjectHandler{service: service}
}

func (h *ProjectHandler) Create(c *gin.Context) {
    userID, _ := c.Get("userID")

    var input struct {
        Name        string `json:"name" binding:"required"`
        Description string `json:"description"`
        AdoID       string `json:"ado_id"`
        Status      string `json:"status" binding:"required"`
        Visibility  string `json:"visibility" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    project := &models.Project{
        Name:        input.Name,
        Description: input.Description,
        AdoID:       input.AdoID,
        Status:      input.Status,
        Visibility:  input.Visibility,
        UserID:      userID.(uint),
    }

    if err := h.service.Create(project); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
        return
    }

    c.JSON(http.StatusCreated, project)
}

func (h *ProjectHandler) List(c *gin.Context) {
    userID, _ := c.Get("userID")
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

    projects, total, err := h.service.List(userID.(uint), page, limit)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "data": projects,
        "meta": gin.H{
            "total": total,
            "page":  page,
            "limit": limit,
        },
    })
}

func (h *ProjectHandler) Get(c *gin.Context) {
    userID, _ := c.Get("userID")
    projectID, err := strconv.ParseUint(c.Param("projectId"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
        return
    }

    project, err := h.service.Get(uint(projectID), userID.(uint))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
        return
    }

    c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) Update(c *gin.Context) {
    userID, _ := c.Get("userID")
    projectID, err := strconv.ParseUint(c.Param("projectId"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
        return
    }

    var input struct {
        Name        string `json:"name"`
        Description string `json:"description"`
        AdoID       string `json:"ado_id"` // Ensure ado_id is included
        Status      string `json:"status"`
        Visibility  string `json:"visibility"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    project, err := h.service.Get(uint(projectID), userID.(uint))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
        return
    }

    if input.Name != "" {
        project.Name = input.Name
    }
    if input.Description != "" {
        project.Description = input.Description
    }
    if input.AdoID != "" { // Ensure ado_id is updated
        project.AdoID = input.AdoID
    }
    if input.Status != "" {
        project.Status = input.Status
    }
    if input.Visibility != "" {
        project.Visibility = input.Visibility
    }

    if err := h.service.Update(project); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
        return
    }

    c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) Delete(c *gin.Context) {
    userID, _ := c.Get("userID")
    projectID, err := strconv.ParseUint(c.Param("projectId"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
        return
    }

    if err := h.service.Delete(uint(projectID), userID.(uint)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}
