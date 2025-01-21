package main

import (
	"api/internal/config"
	"api/internal/handlers"
	"api/internal/middleware"
	"api/internal/repository"
	"api/internal/services"
	"api/pkg/database"
	"api/pkg/database/migrations"
	"flag"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	migrate := flag.Bool("migrate", false, "Run database migrations")
	seed := flag.Bool("seed", false, "Seed database with initial data")
	flag.Parse()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := database.NewPostgresDB(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if *migrate || *seed {
		if *migrate {
			log.Println("Running migrations...")
			if err := migrations.RunMigrations(db); err != nil {
				log.Fatalf("Failed to run migrations: %v", err)
			}
		}
		if *seed {
			log.Println("Seeding database...")
			if err := migrations.SeedData(db); err != nil {
				log.Fatalf("Failed to seed database: %v", err)
			}
		}
		return
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	projectRepo := repository.NewProjectRepository(db)
	moduleRepo := repository.NewModuleRepository(db)
	repositoryRepo := repository.NewRepositoriesRepository(db)

	// Initialize services
	userService := services.NewUserService(userRepo, cfg.JWTSecret)
	projectService := services.NewProjectService(projectRepo)
	moduleService := services.NewModuleService(moduleRepo)
	repositoryService := services.NewRepositoryService(repositoryRepo)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userService)
	projectHandler := handlers.NewProjectHandler(projectService)
	moduleHandler := handlers.NewModuleHandler(moduleService)
	repositoryHandler := handlers.NewRepositoryHandler(repositoryService)

	// Initialize Gin
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Error handling middleware
	r.Use(middleware.ErrorHandler())

	// Public routes
	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)
	r.POST("/recover-password", userHandler.RecoverPassword)

	// Authenticated routes
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		// Project routes
		projects := auth.Group("/projects")
		{
			projects.POST("", projectHandler.Create)
			projects.GET("", projectHandler.List)
			projects.GET("/:projectId", projectHandler.Get)
			projects.DELETE("/:projectId", projectHandler.Delete)
			projects.PUT("/:projectId", projectHandler.Update)

			// Module routes
			modules := projects.Group("/:projectId/modules")
			{
				modules.POST("", moduleHandler.Create)
				modules.GET("", moduleHandler.List)
				modules.GET("/:moduleId", moduleHandler.Get)
				modules.PUT("/:moduleId", moduleHandler.Update)
				modules.DELETE("/:moduleId", moduleHandler.Delete)

				// Repository routes
				repositories := modules.Group("/:moduleId/repository")
				{
					repositories.GET("", repositoryHandler.GetRepository)
					repositories.POST("", repositoryHandler.SaveRepository)
					repositories.DELETE("", repositoryHandler.DeleteRepository)
					repositories.POST("/sync", repositoryHandler.SyncRepository)
				}
			}
		}
	}

	// Start the server
	log.Printf("Server starting on %s", cfg.ServerAddress)
	if err := r.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
