package models

import "time"

type Module struct {
    ID              uint      `gorm:"primarykey" json:"id"`
    ProjectID       uint      `gorm:"not null" json:"project_id"`
    Name            string    `gorm:"not null" json:"name"`
    Description     string    `json:"description"`
    RepositoryURL   string    `json:"repository_url"`
    Status          string    `gorm:"not null" json:"status"`
    Visibility      string    `gorm:"not null" json:"visibility"`
    ContentSource   string    `gorm:"type:text" json:"content_source"`
    ContentHTML     string    `gorm:"type:text" json:"content_html"`
    TechnologyID    uint      `json:"technology_id"`
    LanguageID      uint      `json:"language_id"`
    FrameworkID     uint      `json:"framework_id"`
    NetworkID       uint      `json:"network_id"`
    MockSetID       uint      `json:"mock_set_id"`
    Project         Project   `gorm:"foreignKey:ProjectID" json:"project"`
    Technology      Technology `gorm:"foreignKey:TechnologyID" json:"technology"`
    Language        Language  `gorm:"foreignKey:LanguageID" json:"language"`
    Framework       Framework `gorm:"foreignKey:FrameworkID" json:"framework"`
    Network         Network   `gorm:"foreignKey:NetworkID" json:"network"`
    MockSet        MockSet   `gorm:"foreignKey:MockSetID" json:"mock_set"`
    DateTimeCreated  time.Time `gorm:"autoCreateTime" json:"date_time_created"`
    DateTimeModified time.Time `gorm:"autoUpdateTime" json:"date_time_modified"`
}
