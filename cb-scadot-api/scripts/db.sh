#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Set project root
PROJECT_ROOT="/Users/asimovia/prj/pwc/sync/open-api-tool/api"
cd "${PROJECT_ROOT}"

usage() {
    echo "Database Management Tool"
    echo
    echo "Usage: $0 <command>"
    echo
    echo "Commands:"
    echo "  up      - Run all pending migrations"
    echo "  seed    - Seed reference data"
    echo "  reset   - Reset database and rerun migrations"
    echo "  connect - Connect to database console"
    echo "  status  - Show migration status"
}

ensure_container_running() {
    if ! docker-compose ps | grep -q "api-db-1.*running"; then
        echo -e "${YELLOW}Starting database container...${NC}"
        docker-compose up -d db
        # Wait for PostgreSQL to be ready
        echo "Waiting for database to be ready..."
        for i in {1..30}; do
            if docker exec api-db-1 pg_isready -U postgres >/dev/null 2>&1; then
                echo -e "${GREEN}Database is ready${NC}"
                break
            fi
            if [ $i -eq 30 ]; then
                echo -e "${RED}Database failed to start${NC}"
                docker-compose logs db
                exit 1
            fi
            echo "Attempt $i/30: Waiting for database..."
            sleep 1
        done
    fi
}

case "$1" in
    "up")
        ensure_container_running
        echo -e "${YELLOW}Running migrations...${NC}"
        go run cmd/main.go -migrate=true
        echo -e "${GREEN}Migrations completed${NC}"
        ;;
    "seed")
        ensure_container_running
        echo -e "${YELLOW}Seeding database...${NC}"
        go run cmd/main.go -seed=true
        echo -e "${GREEN}Seeding completed${NC}"
        ;;
    "reset")
        echo -e "${RED}Warning: This will delete all data. Are you sure? (y/N)${NC}"
        read -r confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo -e "${YELLOW}Stopping containers...${NC}"
            docker-compose down
            echo -e "${YELLOW}Removing volume...${NC}"
            docker volume rm api_postgres_data || true
            echo -e "${YELLOW}Starting fresh database...${NC}"
            docker-compose up -d db
            sleep 5
            echo -e "${YELLOW}Running migrations...${NC}"
            go run cmd/main.go -migrate=true
            echo -e "${YELLOW}Seeding database...${NC}"
            go run cmd/main.go -seed=true
            echo -e "${GREEN}Database reset completed${NC}"
        fi
        ;;
    "connect")
        ensure_container_running
        echo -e "${YELLOW}Connecting to database...${NC}"
        docker exec -it api-db-1 psql -U postgres -d pwc_api
        ;;
    "status")
        ensure_container_running
        echo -e "${YELLOW}Checking migration status...${NC}"
        docker exec api-db-1 psql -U postgres -d pwc_api -c "SELECT * FROM migrations ORDER BY id;"
        ;;
    *)
        usage
        exit 1
        ;;
esac