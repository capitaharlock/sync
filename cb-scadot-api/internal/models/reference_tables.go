package models

import "time"

type Technology struct {
    ID               uint      `gorm:"primarykey" json:"id"`
    Name             string    `gorm:"not null" json:"name"`
    Description      string    `json:"description"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}

type Language struct {
    ID               uint      `gorm:"primarykey" json:"id"`
    Name             string    `gorm:"not null" json:"name"`
    Version          string    `json:"version"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}

type Framework struct {
    ID               uint      `gorm:"primarykey" json:"id"`
    Name             string    `gorm:"not null" json:"name"`
    Version          string    `json:"version"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}

type Network struct {
    ID               uint      `gorm:"primarykey" json:"id"`
    Name             string    `gorm:"not null" json:"name"`
    Type             string    `json:"type"`
    Configuration    string    `gorm:"type:text" json:"configuration"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}

type MockSet struct {
    ID               uint      `gorm:"primarykey" json:"id"`
    Name             string    `gorm:"not null" json:"name"`
    Description      string    `json:"description"`
    Configuration    string    `gorm:"type:text" json:"configuration"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}
