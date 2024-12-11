package models

import "time"

type ProjectMember struct {
    ID          uint      `gorm:"primarykey" json:"id"`
    ProjectID   uint      `gorm:"not null" json:"project_id"`
    UserID      uint      `gorm:"not null" json:"user_id"`
    Permission  int       `gorm:"not null" json:"permission"`
    Project     Project   `gorm:"foreignKey:ProjectID" json:"project"`
    User        User      `gorm:"foreignKey:UserID" json:"user"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}
