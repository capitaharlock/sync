package models

import "time"

type Repository struct {
	ID                 uint      `gorm:"primarykey" json:"id"`
	ModuleID           uint      `gorm:"not null" json:"module_id"`
	RepositoryProvider *string   `gorm:"not null" json:"repository_provider,omitempty"`
	RepositoryURL      *string   `gorm:"not null" json:"repository_url,omitempty"`
	AccessToken        *string   `gorm:"not null" json:"access_token,omitempty"`
	CreatedAt          time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt          time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
