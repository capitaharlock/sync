package marketplace

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler handles marketplace operations
type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

// RegisterRoutes registers marketplace routes based on UI flow
func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
    marketplace := r.Group("/marketplace")
    {
        // Contract-related routes (from Contract's list screen)
        contracts := marketplace.Group("/contracts")
        {
            contracts.GET("", h.ListContracts)         // Show contract list from different suppliers
            contracts.GET("/:id", h.GetContract)       // Show contract extended data and conditions
        }

        // Asset-related routes (from Asset details screen)
        assets := marketplace.Group("/assets")
        {
            assets.GET("", h.ListAssets)              // List available assets to purchase
            assets.GET("/:id", h.GetAsset)            // Show asset details with buy button
            assets.GET("/:id/details", h.GetAssetDetails) // Show all contract extended data
        }

        // User desktop related routes
        marketplace.GET("/user/desktop", h.GetUserDesktop)       // Get user's desktop data
        marketplace.GET("/user/notifications", h.GetNotifications) // Get user notifications
    }
}

// Contract handlers
func (h *Handler) ListContracts(c *gin.Context) {
    // List showing contracts from different suppliers
    // Shows available shares to purchase
    c.JSON(http.StatusOK, gin.H{"message": "List of contracts with available shares"})
}

func (h *Handler) GetContract(c *gin.Context) {
    contractID := c.Param("id")
    // Show contract extended data and conditions
    // Show buy button here
    c.JSON(http.StatusOK, gin.H{
        "message": "Contract details with conditions",
        "id": contractID,
    })
}

// Asset handlers
func (h *Handler) ListAssets(c *gin.Context) {
    // Brief of assets with statistics
    c.JSON(http.StatusOK, gin.H{"message": "List of available assets"})
}

func (h *Handler) GetAsset(c *gin.Context) {
    assetID := c.Param("id")
    // Asset details from marketplace view
    c.JSON(http.StatusOK, gin.H{
        "message": "Asset details with purchase options",
        "id": assetID,
    })
}

func (h *Handler) GetAssetDetails(c *gin.Context) {
    assetID := c.Param("id")
    // Show all the contract extended data
    c.JSON(http.StatusOK, gin.H{
        "message": "Detailed asset information",
        "id": assetID,
    })
}

// Desktop handlers
func (h *Handler) GetUserDesktop(c *gin.Context) {
    // Return user's desktop data:
    // - Brief of assets
    // - Statistics
    // - Notifications
    c.JSON(http.StatusOK, gin.H{
        "message": "User desktop information",
    })
}

func (h *Handler) GetNotifications(c *gin.Context) {
    // Get user notifications
    c.JSON(http.StatusOK, gin.H{
        "message": "User notifications",
    })
}