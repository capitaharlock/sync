#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Set project root
PROJECT_ROOT="/Users/asimovia/prj/pwc/sync/open-api-tool/api"
cd "${PROJECT_ROOT}"

echo -e "${YELLOW}Checking reference data...${NC}"

# Check if tables have data using docker exec
EMPTY_TABLES=$(docker exec api-db-1 psql -U postgres -d pwc_api -t -A -c "
    SELECT string_agg(table_name, ', ')
    FROM (
        SELECT 'technologies' as table_name, count(*) as count FROM technologies
        UNION ALL
        SELECT 'languages', count(*) FROM languages
        UNION ALL
        SELECT 'frameworks', count(*) FROM frameworks
        UNION ALL
        SELECT 'networks', count(*) FROM networks
        UNION ALL
        SELECT 'mock_sets', count(*) FROM mock_sets
    ) counts
    WHERE count = 0;")

if [ ! -z "$EMPTY_TABLES" ]; then
    echo -e "${YELLOW}Empty tables found: $EMPTY_TABLES${NC}"
    echo -e "${YELLOW}Running seed script...${NC}"
    ./scripts/db.sh seed
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to seed database${NC}"
        exit 1
    fi
    echo -e "${GREEN}Database seeded successfully${NC}"
else
    echo -e "${GREEN}Reference data exists, proceeding with tests${NC}"
fi

# Run the tests
echo -e "${YELLOW}Running API tests...${NC}"
cd cmd/apitest
go mod tidy
go test -v
