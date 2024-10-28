package auth

import (
	"github.com/gin-gonic/gin"
)

// Basic login request structure
type LoginRequest struct {
    Email    string `json:"email" example:"user@example.com"`
    Password string `json:"password" example:"pass123"`
}

// Response after successful login
type LoginResponse struct {
    Token        string `json:"token" example:"eyJhbG..."`
    RefreshToken string `json:"refresh_token" example:"eyJhbG..."`
    ExpiresIn    int    `json:"expires_in" example:"3600"`
}

// Standard error response
type ErrorResponse struct {
    Code    int    `json:"code" example:"400"`
    Message string `json:"message" example:"Invalid credentials"`
}

// User registration data
type SignupRequest struct {
    Email     string `json:"email" example:"user@example.com"`
    Password  string `json:"password" example:"pass123"`
    FirstName string `json:"first_name" example:"John"`
    LastName  string `json:"last_name" example:"Doe"`
}

// Password recovery request
type ForgotPasswordRequest struct {
    Email string `json:"email" example:"user@example.com"`
}

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

// Sets up public auth routes
func (h *Handler) RegisterPublicRoutes(r *gin.RouterGroup) {
    auth := r.Group("/auth")
    {
        auth.POST("/login", h.Login)
        auth.POST("/signup", h.Signup)
        auth.POST("/forgot-password", h.ForgotPassword)
    }
}

// @Summary Login
// @Description Login with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param body body LoginRequest true "Login data"
// @Success 200 {object} LoginResponse
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Router /auth/login [post]
func (h *Handler) Login(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Login endpoint"})
}

// @Summary Signup
// @Description Create new user account
// @Tags auth
// @Accept json
// @Produce json
// @Param body body SignupRequest true "User data"
// @Success 201 {object} LoginResponse
// @Failure 400 {object} ErrorResponse
// @Failure 409 {object} ErrorResponse
// @Router /auth/signup [post]
func (h *Handler) Signup(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Signup endpoint"})
}

// @Summary Forgot Password
// @Description Send password reset email
// @Tags auth
// @Accept json
// @Produce json
// @Param body body ForgotPasswordRequest true "Email"
// @Success 200 {object} map[string]string
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /auth/forgot-password [post]
func (h *Handler) ForgotPassword(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Forgot password endpoint"})
}