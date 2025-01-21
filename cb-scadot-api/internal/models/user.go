package models

import "time"

type User struct {
    ID                uint      `gorm:"primarykey" json:"id"`
    Email             string    `gorm:"uniqueIndex;not null" json:"email"`
    Password          string    `gorm:"not null" json:"-"`
    Name              string    `gorm:"not null" json:"name"`
    ResetPasswordToken string    `json:"-"`
    DateTimeCreated   time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified  time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}
