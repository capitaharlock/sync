#!/bin/bash

# Base directory
BASE_DIR="/Users/asimovia/prj/pwc/sync/open-api-tool/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Folder structure:${NC}"
cd "${BASE_DIR}" && ls -R

echo -e "\n${GREEN}File contents:${NC}"

# Function to print file content
print_file_content() {
    local file=$1
    local relative_path=${file#$BASE_DIR/}
    
    echo -e "\n${BLUE}=== $relative_path ===${NC}"
    echo "Contents:"
    cat "$file"
    echo -e "\n${BLUE}=== End of $relative_path ===${NC}\n"
}

# Print content of main files
FILES=(
    "cmd/api/main.go"
    "go.mod"
    "go.sum"
    "docker-compose.yml"
    "Dockerfile"
    ".env"
)

for file in "${FILES[@]}"; do
    if [ -f "$BASE_DIR/$file" ]; then
        print_file_content "$BASE_DIR/$file"
    else
        echo -e "${BLUE}File $file does not exist${NC}"
    fi
done

# Print all other .go files
find "${BASE_DIR}" -name "*.go" | while read -r file; do
    # Skip main.go as it's already printed
    if [[ "$file" != *"cmd/api/main.go"* ]]; then
        print_file_content "$file"
    fi
done

echo -e "${GREEN}End of file listing${NC}"