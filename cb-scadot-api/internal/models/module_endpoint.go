package models

import "time"

type ModuleEndpoint struct {
    ID              uint      `gorm:"primarykey" json:"id"`
    ProjectID       uint      `gorm:"not null" json:"project_id"`
    ModuleID        uint      `gorm:"not null" json:"module_id"`
    Input           string    `gorm:"type:text" json:"input"`
    Output          string    `gorm:"type:text" json:"output"`
    Project         Project   `gorm:"foreignKey:ProjectID" json:"project"`
    Module          Module    `gorm:"foreignKey:ModuleID" json:"module"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}
