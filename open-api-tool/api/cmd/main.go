package main

import (
    "flag"
    "log"
    "api/internal/config"
    "api/internal/handlers"
    "api/internal/middleware"
    "api/internal/repository"
    "api/internal/services"
    "api/pkg/database"
    "api/pkg/database/migrations"
    "github.com/gin-gonic/gin"
)

func main() {
    // Command line flags for database operations
    migrate := flag.Bool("migrate", false, "Run database migrations")
    seed := flag.Bool("seed", false, "Seed database with initial data")
    flag.Parse()

    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }

    // Initialize database
    db, err := database.NewPostgresDB(cfg.Database)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }

    // Handle database operations flags
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

    // Initialize services
    userService := services.NewUserService(userRepo, cfg.JWTSecret)
    projectService := services.NewProjectService(projectRepo)
    moduleService := services.NewModuleService(moduleRepo)

    // Initialize handlers
    userHandler := handlers.NewUserHandler(userService)
    projectHandler := handlers.NewProjectHandler(projectService)
    moduleHandler := handlers.NewModuleHandler(moduleService)

    // Initialize router
    r := gin.Default()

    // Use error handler middleware
    r.Use(middleware.ErrorHandler())

    // Public routes
    r.POST("/register", userHandler.Register)
    r.POST("/login", userHandler.Login)
    r.POST("/recover-password", userHandler.RecoverPassword)

    // Protected routes
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

            // Module routes - nested under projects
            modules := projects.Group("/:projectId/modules")
            {
                modules.POST("", moduleHandler.Create)
                modules.GET("/:moduleId", moduleHandler.Get)
                modules.PUT("/:moduleId", moduleHandler.Update)
                modules.DELETE("/:moduleId", moduleHandler.Delete)
            }
        }
    }

    // Start server
    log.Printf("Server starting on %s", cfg.ServerAddress)
    if err := r.Run(cfg.ServerAddress); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}