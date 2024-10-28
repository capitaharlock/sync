package investor 
 
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
    investor := r.Group("/investor") 
    { 
        // Contract and investment management 
        contracts := investor.Group("/contracts") 
        { 
            contracts.GET("", h.ListContracts) 
            contracts.GET("/:id", h.GetContract) 
            contracts.POST("/:id/invest", h.InvestInContract) 
        } 
 
        // Asset management 
        assets := investor.Group("/assets") 
        { 
            assets.GET("", h.ListAssets) 
            assets.GET("/:id", h.GetAsset) 
            assets.POST("/:id/sell", h.SellAsset) 
        } 
 
        // Dashboard and profile 
        investor.GET("/dashboard", h.GetDashboard) 
        investor.GET("/stats", h.GetStats) 
        investor.GET("/profile", h.GetProfile) 
        investor.PUT("/profile", h.UpdateProfile) 
    } 
} 
