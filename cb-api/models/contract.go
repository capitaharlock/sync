package models 
 
import "gorm.io/gorm" 
 
type Contract struct { 
    gorm.Model 
    SupplierID      uint    `json:"supplier_id"` 
    Title           string  `json:"title"` 
    Description     string  `json:"description"` 
    Conditions      string  `json:"conditions"` 
    Status          string  `json:"status"` 
    SharesTotal     int     `json:"shares_total"` 
    SharesAvailable int     `json:"shares_available"` 
} 
