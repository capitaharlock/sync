#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Set project root (using the actual path from your project)
PROJECT_ROOT="/Users/asimovia/prj/pwc/sync/open-api-tool/api"
cd "${PROJECT_ROOT}"

# Function to cleanup processes
cleanup_processes() {
    echo -e "${YELLOW}Cleaning up previous processes...${NC}"
    
    # Find and kill any process running on port 8080
    local pid=$(lsof -ti:8080)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Killing process on port 8080 (PID: $pid)${NC}"
        kill -9 $pid
    fi
}

# Function to cleanup Docker
cleanup_docker() {
    echo -e "${YELLOW}Cleaning up Docker containers...${NC}"
    docker-compose down
    
    # Optional: Remove volumes if you want to start fresh
    docker-compose down -v
}

# Error handling function
handle_error() {
    echo -e "${RED}Error: $1${NC}"
    cleanup_processes
    cleanup_docker
    exit 1
}

# Trap ctrl-c and call cleanup
trap 'echo -e "${YELLOW}\nCleaning up...${NC}"; cleanup_processes; cleanup_docker; exit 1' INT

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    handle_error "Docker is not running. Please start Docker first."
fi

# Initial cleanup
cleanup_processes
cleanup_docker

# Start the database with docker-compose
echo -e "${YELLOW}Starting database with docker-compose...${NC}"
docker-compose up -d db || handle_error "Failed to start database container"

# Wait for database to be ready
echo "Waiting for database to be ready..."
for i in {1..30}; do
    if docker exec api-db-1 pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}Database is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        handle_error "Database failed to start"
    fi
    echo "Attempt $i/30: Waiting for database..."
    sleep 1
done

# Run the application
echo -e "${GREEN}Starting the application...${NC}"
go run "${PROJECT_ROOT}/cmd/main.go" || handle_error "Application failed to start"