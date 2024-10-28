package models 
 
import "gorm.io/gorm" 
 
type UserType string 
 
const ( 
    UserTypeMarketplace UserType = "marketplace" 
    UserTypeSupplier    UserType = "supplier" 
    UserTypeBuyer       UserType = "buyer" 
    UserTypeInvestor    UserType = "investor" 
) 
 
type User struct { 
    gorm.Model 
    Email       string   `json:"email" gorm:"unique"` 
    Password    string   `json:"-"` 
    UserType    UserType `json:"user_type"` 
    ProfileData string   `json:"profile_data"` 
} 
