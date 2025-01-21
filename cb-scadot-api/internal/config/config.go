// internal/config/config.go
package config

import (
    "github.com/joho/godotenv"
    "api/pkg/database"
    "os"
)

type Config struct {
    Database database.Config
    JWTSecret string
    ServerAddress string
}

func Load() (*Config, error) {
    if err := godotenv.Load(); err != nil {
        return nil, err
    }

    return &Config{
        Database: database.Config{
            Host:     getEnvOrDefault("DB_HOST", "localhost"),
            Port:     getEnvOrDefault("DB_PORT", "5432"),
            User:     getEnvOrDefault("DB_USER", "postgres"),
            Password: os.Getenv("DB_PASSWORD"),
            DBName:   getEnvOrDefault("DB_NAME", "pwc_api"),
            SSLMode:  getEnvOrDefault("DB_SSLMODE", "disable"),
        },
        JWTSecret:     getEnvOrDefault("JWT_SECRET", "scadot-secret-key"),
        ServerAddress: getEnvOrDefault("SERVER_ADDRESS", ":8080"),
    }, nil
}

func getEnvOrDefault(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}