package migrations

import (
    "fmt"
    "api/internal/models"
    "gorm.io/gorm"
)

type Migration struct {
    ID        uint   `gorm:"primarykey"`
    Name      string `gorm:"uniqueIndex"`
    Applied   bool
    CreatedAt int64
}

func RunMigrations(db *gorm.DB) error {
    // Create migrations table if it doesn't exist
    if err := db.AutoMigrate(&Migration{}); err != nil {
        return fmt.Errorf("failed to create migrations table: %v", err)
    }

    // Auto migrate schemas
    if err := db.AutoMigrate(
        &models.User{},
        &models.Project{},
        &models.ProjectMember{},
        &models.Module{},
        &models.ModuleEndpoint{},
        &models.Technology{},
        &models.Language{},
        &models.Framework{},
        &models.Network{},
        &models.MockSet{},
    ); err != nil {
        return fmt.Errorf("failed to migrate schemas: %v", err)
    }

    return nil
}

func SeedData(db *gorm.DB) error {
    // Your existing seed data logic here
    return seedReferenceData(db)
}

func ResetDatabase(db *gorm.DB) error {
    // Drop all tables
    if err := db.Exec(`
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
        END $$;
    `).Error; err != nil {
        return fmt.Errorf("failed to drop tables: %v", err)
    }

    // Rerun migrations
    return RunMigrations(db)
}

// Mock data
func seedReferenceData(db *gorm.DB) error {
    // Technologies
    technologies := []models.Technology{
        {Name: "Microservices", Description: "Microservices architecture"},
        {Name: "Serverless", Description: "Serverless computing"},
    }
    
    if err := db.Create(&technologies).Error; err != nil {
        return fmt.Errorf("failed to seed technologies: %v", err)
    }

    // Languages
    languages := []models.Language{
        {Name: "Go", Version: "1.21"},
        {Name: "Python", Version: "3.11"},
    }
    
    if err := db.Create(&languages).Error; err != nil {
        return fmt.Errorf("failed to seed languages: %v", err)
    }

    // Frameworks
    frameworks := []models.Framework{
        {Name: "Gin", Version: "1.9.1"},
        {Name: "Echo", Version: "4.11.0"},
    }
    
    if err := db.Create(&frameworks).Error; err != nil {
        return fmt.Errorf("failed to seed frameworks: %v", err)
    }

    // Networks
    networks := []models.Network{
        {Name: "Default VPC", Type: "vpc", Configuration: `{"cidr": "10.0.0.0/16"}`},
        {Name: "Public Subnet", Type: "subnet", Configuration: `{"cidr": "10.0.1.0/24"}`},
    }
    
    if err := db.Create(&networks).Error; err != nil {
        return fmt.Errorf("failed to seed networks: %v", err)
    }

    // MockSets
    mockSets := []models.MockSet{
        {Name: "User API Mocks", Description: "Mock responses for user API", Configuration: `{"endpoints": ["users", "auth"]}`},
        {Name: "Payment API Mocks", Description: "Mock responses for payment API", Configuration: `{"endpoints": ["payments", "refunds"]}`},
    }
    
    if err := db.Create(&mockSets).Error; err != nil {
        return fmt.Errorf("failed to seed mock sets: %v", err)
    }

    return nil
}