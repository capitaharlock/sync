package migrations

import (
	"api/internal/models"
	"fmt"

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
    // Delete existing data first
    db.Exec("TRUNCATE technologies, languages, frameworks, networks, mock_sets RESTART IDENTITY CASCADE")
    
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
        {ID: 1, Name: "Microservices", Description: "Microservices architecture"},
        {ID: 2, Name: "Serverless", Description: "Serverless computing"},
        {ID: 3, Name: "Monolithic", Description: "Monolithic architecture"},
    }

    for _, tech := range technologies {
        result := db.FirstOrCreate(&tech, models.Technology{ID: tech.ID})
        if result.Error != nil {
            return fmt.Errorf("failed to seed technology %s: %v", tech.Name, result.Error)
        }
    }

    // Languages
    languages := []models.Language{
        {ID: 1, Name: "Go", Version: "1.21"},
        {ID: 2, Name: "Python", Version: "3.11"},
        {ID: 3, Name: "JavaScript", Version: "ES2022"},
    }

    for _, lang := range languages {
        result := db.FirstOrCreate(&lang, models.Language{ID: lang.ID})
        if result.Error != nil {
            return fmt.Errorf("failed to seed language %s: %v", lang.Name, result.Error)
        }
    }

    // Frameworks
    frameworks := []models.Framework{
        {ID: 1, Name: "Gin", Version: "1.9.1"},
        {ID: 2, Name: "Echo", Version: "4.11.0"},
        {ID: 3, Name: "FastAPI", Version: "0.100.0"},
    }

    for _, framework := range frameworks {
        result := db.FirstOrCreate(&framework, models.Framework{ID: framework.ID})
        if result.Error != nil {
            return fmt.Errorf("failed to seed framework %s: %v", framework.Name, result.Error)
        }
    }

    // Networks
    networks := []models.Network{
        {ID: 1, Name: "Default VPC", Type: "vpc", Configuration: `{"cidr": "10.0.0.0/16"}`},
        {ID: 2, Name: "Public Subnet", Type: "subnet", Configuration: `{"cidr": "10.0.1.0/24"}`},
        {ID: 3, Name: "Private Subnet", Type: "subnet", Configuration: `{"cidr": "10.0.2.0/24"}`},
    }

    for _, network := range networks {
        result := db.FirstOrCreate(&network, models.Network{ID: network.ID})
        if result.Error != nil {
            return fmt.Errorf("failed to seed network %s: %v", network.Name, result.Error)
        }
    }

    // MockSets
    mockSets := []models.MockSet{
        {ID: 1, Name: "User API Mocks", Description: "Mock responses for user API", Configuration: `{"endpoints": ["users", "auth"]}`},
        {ID: 2, Name: "Payment API Mocks", Description: "Mock responses for payment API", Configuration: `{"endpoints": ["payments", "refunds"]}`},
        {ID: 3, Name: "Order API Mocks", Description: "Mock responses for order API", Configuration: `{"endpoints": ["orders", "items"]}`},
    }

    for _, mockSet := range mockSets {
        result := db.FirstOrCreate(&mockSet, models.MockSet{ID: mockSet.ID})
        if result.Error != nil {
            return fmt.Errorf("failed to seed mock set %s: %v", mockSet.Name, result.Error)
        }
    }

    return nil
}