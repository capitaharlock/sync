package database

import (
    "fmt"
    "api/pkg/database/migrations"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func NewPostgresDB(config Config) (*gorm.DB, error) {
    dsn := BuildDSN(config)
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, err
    }

    // Run migrations
    if err := migrations.RunMigrations(db); err != nil {
        return nil, err
    }

    return db, nil
}

func BuildDSN(config Config) string {
    return fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode,
    )
}
