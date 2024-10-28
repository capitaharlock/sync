package supplier 
 
import ( 
    "github.com/gin-gonic/gin" 
    "net/http" 
) 
 
type Handler struct { 
    service *Service 
} 
 
func NewHandler(service *Service) *Handler { 
    return &Handler{service: service} 
} 
 
func (h *Handler) RegisterRoutes(r *gin.RouterGroup) { 
    supplier := r.Group("/supplier") 
    { 
        // Contract management 
        contracts := supplier.Group("/contracts") 
        { 
            contracts.GET("", h.ListContracts) 
            contracts.POST("", h.CreateContract) 
            contracts.GET("/:id", h.GetContract) 
            contracts.PUT("/:id", h.UpdateContract) 
            contracts.DELETE("/:id", h.DeleteContract) 
            contracts.POST("/:id/publish", h.PublishContract) 
        } 
 
        // Asset management 
        assets := supplier.Group("/assets") 
        { 
            assets.GET("", h.ListAssets) 
            assets.POST("/:id/sell", h.SellAsset) 
        } 
 
        // Dashboard and profile 
        supplier.GET("/dashboard", h.GetDashboard) 
        supplier.GET("/stats", h.GetStats) 
        supplier.GET("/profile", h.GetProfile) 
        supplier.PUT("/profile", h.UpdateProfile) 
    } 
} 
