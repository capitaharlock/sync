package migrations

import (
	"api/internal/models"
	"api/internal/utils"
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
		&models.Repository{}, // Add the Repository model here
	); err != nil {
		return fmt.Errorf("failed to migrate schemas: %v", err)
	}

	return nil
}

func SeedData(db *gorm.DB) error {
	// Delete existing data first
	db.Exec("TRUNCATE technologies, languages, frameworks, networks, repositories RESTART IDENTITY CASCADE")

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

	// Repositories
	repositories := []models.Repository{
		{
			ModuleID:           1, // Assuming module with ID 1 exists
			RepositoryProvider: "github",
			RepositoryURL:      "https://github.com/example/repo1",
			AccessToken:        "ghp_exampletoken1",
		},
		{
			ModuleID:           2, // Assuming module with ID 2 exists
			RepositoryProvider: "gitlab",
			RepositoryURL:      "https://gitlab.com/example/repo2",
			AccessToken:        "glpat-exampletoken2",
		},
	}

	for _, repo := range repositories {
		result := db.FirstOrCreate(&repo, models.Repository{ModuleID: repo.ModuleID})
		if result.Error != nil {
			return fmt.Errorf("failed to seed repository for module %d: %v", repo.ModuleID, result.Error)
		}
	}

	// Add an initial user
	initialUser := models.User{
		ID:       1, // You can use any unique ID
		Email:    "admin@example.com",
		Password: "password123", // You should hash this password in a real application
	}

	// Hash the password before saving (assuming you have a utility function for this)
	hashedPassword, err := utils.HashPassword(initialUser.Password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}
	initialUser.Password = hashedPassword

	// Save the initial user
	result := db.FirstOrCreate(&initialUser, models.User{ID: initialUser.ID})
	if result.Error != nil {
		return fmt.Errorf("failed to seed initial user: %v", result.Error)
	}

	return nil
}
