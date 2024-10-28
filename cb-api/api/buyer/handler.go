package buyer

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Basic contract info for catalog listing
type ContractCatalog struct {
    ID          string  `json:"id" example:"ct_123"`
    Name        string  `json:"name" example:"Solar Energy Contract"`
    Price       float64 `json:"price" example:"1500.50"`
    Supplier    string  `json:"supplier" example:"EcoEnergy Ltd"`
}

// Asset represents a minted contract
type Asset struct {
    ID        string `json:"id" example:"ast_123"`
    Contract  string `json:"contract" example:"ct_123"`
    MintedAt  string `json:"minted_at" example:"2024-01-01T10:00:00Z"`
    Status    string `json:"status" example:"active"`
}

// Stats for assets overview
type AssetStats struct {
    Total     int     `json:"total" example:"10"`
    TotalValue float64 `json:"total_value" example:"15000.50"`
}

// Buyer profile data
type Profile struct {
    Name    string `json:"name" example:"John Doe"`
    Email   string `json:"email" example:"john@company.com"`
    Company string `json:"company" example:"Customer Corp"`
}

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
    buyer := r.Group("/buyer")
    {
        contracts := buyer.Group("/contracts")
        {
            contracts.GET("/catalog", h.ListContractCatalog)
            contracts.GET("/catalog/:id", h.GetContractFromCatalog)
            contracts.POST("/catalog/:id/mint", h.MintContract)
        }

        assets := buyer.Group("/assets")
        {
            assets.GET("", h.ListAssets)
            assets.GET("/:id", h.GetAsset)
            assets.GET("/stats", h.GetAssetStats)
        }

        buyer.GET("/desktop", h.GetDesktop)
        buyer.GET("/profile", h.GetProfile)
        buyer.PUT("/profile", h.UpdateProfile)
        buyer.GET("/statistics", h.GetStatistics)
        buyer.GET("/notifications", h.GetNotifications)
    }
}

// @Summary List contract catalog
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {array} ContractCatalog
// @Router /buyer/contracts/catalog [get]
func (h *Handler) ListContractCatalog(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "List catalog"})
}

// @Summary Get contract details
// @Tags buyer
// @Accept json
// @Produce json
// @Param id path string true "Contract ID"
// @Success 200 {object} ContractCatalog
// @Router /buyer/contracts/catalog/{id} [get]
func (h *Handler) GetContractFromCatalog(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Contract details"})
}

// @Summary Mint contract
// @Tags buyer
// @Accept json
// @Produce json
// @Param id path string true "Contract ID"
// @Success 201 {object} Asset
// @Router /buyer/contracts/catalog/{id}/mint [post]
func (h *Handler) MintContract(c *gin.Context) {
    c.JSON(http.StatusCreated, gin.H{"message": "Contract minted"})
}

// @Summary List assets
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {array} Asset
// @Router /buyer/assets [get]
func (h *Handler) ListAssets(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "List assets"})
}

// @Summary Get asset details
// @Tags buyer
// @Accept json
// @Produce json
// @Param id path string true "Asset ID"
// @Success 200 {object} Asset
// @Router /buyer/assets/{id} [get]
func (h *Handler) GetAsset(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Asset details"})
}

// @Summary Get asset stats
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {object} AssetStats
// @Router /buyer/assets/stats [get]
func (h *Handler) GetAssetStats(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Asset stats"})
}

// @Summary Get desktop info
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /buyer/desktop [get]
func (h *Handler) GetDesktop(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Desktop info"})
}

// @Summary Get profile
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {object} Profile
// @Router /buyer/profile [get]
func (h *Handler) GetProfile(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Profile data"})
}

// @Summary Update profile
// @Tags buyer
// @Accept json
// @Produce json
// @Param body body Profile true "Profile data"
// @Success 200 {object} Profile
// @Router /buyer/profile [put]
func (h *Handler) UpdateProfile(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Profile updated"})
}

// @Summary Get statistics
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /buyer/statistics [get]
func (h *Handler) GetStatistics(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Statistics"})
}

// @Summary Get notifications
// @Tags buyer
// @Accept json
// @Produce json
// @Success 200 {array} map[string]interface{}
// @Router /buyer/notifications [get]
func (h *Handler) GetNotifications(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Notifications"})
}