package auth 
 
import "github.com/gin-gonic/gin" 
 
type Handler struct { 
    service *Service 
} 
 
func NewHandler(service *Service) *Handler { 
    return &Handler{service: service} 
} 
 
func (h *Handler) RegisterPublicRoutes(r *gin.RouterGroup) { 
    auth := r.Group("/auth") 
    { 
        auth.POST("/login", h.Login) 
        auth.POST("/signup", h.Signup) 
        auth.POST("/forgot-password", h.ForgotPassword) 
    } 
} 
 
func (h *Handler) Login(c *gin.Context) { 
    c.JSON(200, gin.H{"message": "Login endpoint"}) 
} 
