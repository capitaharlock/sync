package notifications

import (
    "cb-api/config"
)

type Manager struct {
    config *config.Config
}

func NewManager(cfg *config.Config) *Manager {
    return &Manager{
        config: cfg,
    }
}

func (m *Manager) SendNotification(userID string, message string) error {
    // Implementation to send notifications
    return nil
}
