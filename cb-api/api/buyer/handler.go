package buyer 
 
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
    buyer := r.Group("/buyer") 
    { 
        // Contract catalog management 
        contracts := buyer.Group("/contracts") 
        { 
            contracts.GET("/catalog", h.ListContractCatalog)        // List available contracts to mint 
            contracts.GET("/catalog/:id", h.GetContractFromCatalog) // Get specific contract details from catalog 
            contracts.POST("/catalog/:id/mint", h.MintContract)     // Mint new contract 
        } 
 
        // Asset management 
        assets := buyer.Group("/assets") 
        { 
            assets.GET("", h.ListAssets)           // List all minted assets 
            assets.GET("/:id", h.GetAsset)         // Get specific asset details 
            assets.GET("/stats", h.GetAssetStats)  // Get assets statistics 
        } 
 
        // Dashboard and profile 
        buyer.GET("/desktop", h.GetDesktop)           // Get buyer's desktop information 
        buyer.GET("/profile", h.GetProfile)           // Get buyer's profile 
        buyer.PUT("/profile", h.UpdateProfile)        // Update buyer's profile 
        buyer.GET("/statistics", h.GetStatistics)     // Get buyer's statistics 
        buyer.GET("/notifications", h.GetNotifications) // Get buyer's notifications 
    } 
} 
