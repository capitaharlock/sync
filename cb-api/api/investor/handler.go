package investor

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Contract investment
type Contract struct {
    ID            string  `json:"id" example:"ct_123"`
    Name          string  `json:"name" example:"Solar Farm Project"`
    TotalValue    float64 `json:"total_value" example:"100000"`
    MinInvestment float64 `json:"min_investment" example:"1000"`
    Available     float64 `json:"available" example:"50000"`
}

// Investment request
type InvestRequest struct {
    Amount float64 `json:"amount" example:"5000"`
}

// Invested asset
type Asset struct {
    ID        string  `json:"id" example:"ast_123"`
    ContractID string  `json:"contract_id" example:"ct_123"`
    Amount    float64 `json:"amount" example:"5000"`
    Acquired  string  `json:"acquired" example:"2024-01-15T10:00:00Z"`
}

// Investor profile
type Profile struct {
    Name     string `json:"name" example:"Jane Smith"`
    Email    string `json:"email" example:"jane@investor.com"`
    Category string `json:"category" example:"institutional"`
}

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
    investor := r.Group("/investor")
    {
        contracts := investor.Group("/contracts")
        {
            contracts.GET("", h.ListContracts)
            contracts.GET("/:id", h.GetContract)
            contracts.POST("/:id/invest", h.InvestInContract)
        }

        assets := investor.Group("/assets")
        {
            assets.GET("", h.ListAssets)
            assets.GET("/:id", h.GetAsset)
            assets.POST("/:id/sell", h.SellAsset)
        }

        investor.GET("/dashboard", h.GetDashboard)
        investor.GET("/stats", h.GetStats)
        investor.GET("/profile", h.GetProfile)
        investor.PUT("/profile", h.UpdateProfile)
    }
}

// @Summary List available contracts
// @Tags investor
// @Accept json
// @Produce json
// @Success 200 {array} Contract
// @Router /investor/contracts [get]
func (h *Handler) ListContracts(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "List contracts"})
}

// @Summary Get contract details
// @Tags investor
// @Accept json
// @Produce json
// @Param id path string true "Contract ID"
// @Success 200 {object} Contract
// @Router /investor/contracts/{id} [get]
func (h *Handler) GetContract(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Contract details"})
}

// @Summary Invest in contract
// @Tags investor
// @Accept json
// @Produce json
// @Param id path string true "Contract ID"
// @Param body body InvestRequest true "Investment amount"
// @Success 201 {object} Asset
// @Router /investor/contracts/{id}/invest [post]
func (h *Handler) InvestInContract(c *gin.Context) {
    c.JSON(http.StatusCreated, gin.H{"message": "Investment created"})
}

// @Summary List investments
// @Tags investor
// @Accept json
// @Produce json
// @Success 200 {array} Asset
// @Router /investor/assets [get]
func (h *Handler) ListAssets(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "List assets"})
}

// @Summary Get investment details
// @Tags investor
// @Accept json
// @Produce json
// @Param id path string true "Asset ID"
// @Success 200 {object} Asset
// @Router /investor/assets/{id} [get]
func (h *Handler) GetAsset(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Asset details"})
}

// @Summary Sell investment
// @Tags investor
// @Accept json
// @Produce json
// @Param id path string true "Asset ID"
// @Success 200 {object} map[string]interface{}
// @Router /investor/assets/{id}/sell [post]
func (h *Handler) SellAsset(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Asset sold"})
}

// @Summary Get dashboard info
// @Tags investor
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /investor/dashboard [get]
func (h *Handler) GetDashboard(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Dashboard info"})
}

// @Summary Get investment stats
// @Tags investor
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /investor/stats [get]
func (h *Handler) GetStats(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Investment stats"})
}

// @Summary Get profile
// @Tags investor
// @Accept json
// @Produce json
// @Success 200 {object} Profile
// @Router /investor/profile [get]
func (h *Handler) GetProfile(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Profile data"})
}

// @Summary Update profile
// @Tags investor
// @Accept json
// @Produce json
// @Param body body Profile true "Profile data"
// @Success 200 {object} Profile
// @Router /investor/profile [put]
func (h *Handler) UpdateProfile(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Profile updated"})
}