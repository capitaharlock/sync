package models 
 
import "gorm.io/gorm" 
 
type Asset struct { 
    gorm.Model 
    ContractID   uint    `json:"contract_id"` 
    OwnerID      uint    `json:"owner_id"` 
    SharesAmount int     `json:"shares_amount"` 
    Status       string  `json:"status"` 
} 
