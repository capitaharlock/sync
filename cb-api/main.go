package main

import (
	"cb-api/api"
	"cb-api/config"
	"cb-api/cron"
	"cb-api/database"
	"cb-api/listeners"
	"cb-api/notifications"
	"cb-api/queue"
	"context"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
)

func main() {
	println("Hello, World!")
	// Initialize configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// FIXME: messy
	ctx := context.Background()
	// Initialize database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	conn, err := db.DB.Conn(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer conn.Close()

	defer db.Close()

	// Initialize queue
	q := queue.New()

	// Initialize notification manager
	notifier := notifications.NewManager(cfg)

	// Initialize blockchain listeners
	besuListener := listeners.NewBesuListener(cfg.BesuURL, cfg.BesuObligationSmartContract, q)
	solanaListener := listeners.NewSolanaListener(cfg.SolanaURL, q)

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		besuListener.Start()
		wg.Done()
	}()

	go func() {
		solanaListener.Start()
		wg.Done()
	}()

	// Start cron worker
	go cron.StartWorker(db, q)

	// Initialize Gin router
	router := gin.Default()

	// Register API routes
	api.RegisterRoutes(router, db, q, notifier)

	// Start the server
	if err := router.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

	wg.Wait()
}
