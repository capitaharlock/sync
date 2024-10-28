package config

import (
	"os"
)

type Config struct {
	DatabaseURL                 string
	ServerAddress               string
	BesuURL                     string
	SolanaURL                   string
	BesuObligationSmartContract string
}

func Load() (*Config, error) {
	return &Config{
		DatabaseURL:                 os.Getenv("DATABASE_URL"),
		ServerAddress:               os.Getenv("SERVER_ADDRESS"),
		BesuURL:                     os.Getenv("BESU_URL"),
		SolanaURL:                   os.Getenv("SOLANA_URL"),
		BesuObligationSmartContract: os.Getenv("BESU_OBLIGATION_SMART_CONTRACT"),
	}, nil
}
