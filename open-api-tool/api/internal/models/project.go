package models

import "time"

type Project struct {
    ID               uint      `gorm:"primarykey" json:"id"`
    Name             string    `gorm:"not null" json:"name"`
    Description      string    `json:"description"`
    AdoID           string    `gorm:"column:ado_id" json:"ado_id"`
    Status          string    `gorm:"not null" json:"status"`
    Visibility      string    `gorm:"not null" json:"visibility"`
    UserID          uint      `gorm:"not null" json:"user_id"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
    User            User      `gorm:"foreignKey:UserID" json:"user"`
}
