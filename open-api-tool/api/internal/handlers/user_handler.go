package handlers

import (
    "net/http"
    "api/internal/models"
    "api/internal/services"
    "github.com/gin-gonic/gin"
)

type UserHandler struct {
    service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
    return &UserHandler{service: service}
}

func (h *UserHandler) Register(c *gin.Context) {
    var input struct {
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required,min=6"`
        Name     string `json:"name" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := &models.User{
        Email:    input.Email,
        Password: input.Password,
        Name:     input.Name,
    }

    if err := h.service.Register(user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to register user"})
        return
    }

    c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) Login(c *gin.Context) {
    var input struct {
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    token, err := h.service.Login(input.Email, input.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *UserHandler) RecoverPassword(c *gin.Context) {
    var input struct {
        Email string `json:"email" binding:"required,email"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.service.RecoverPassword(input.Email); err != nil {
        // Don't reveal if email exists
        c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a reset link will be sent"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "If the email exists, a reset link will be sent"})
}
