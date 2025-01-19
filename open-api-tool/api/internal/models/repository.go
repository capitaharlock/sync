package models

import "time"

type Repository struct {
    ID                 uint      `gorm:"primarykey"`
    ModuleID           uint      `gorm:"not null;index"` // Foreign key to the module
    RepositoryProvider string    `gorm:"type:varchar(50);not null"`
    RepositoryURL      string    `gorm:"type:text;not null"`
    AccessToken        string    `gorm:"type:text;not null"`
    CreatedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP"`
    UpdatedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}