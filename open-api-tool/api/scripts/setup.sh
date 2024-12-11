#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_ROOT="/Users/asimovia/prj/pwc/sync/open-api-tool/api"
cd "${API_ROOT}"

echo -e "${YELLOW}Creating test directory structure...${NC}"
# Create test directory structure
mkdir -p "${API_ROOT}/cmd/apitest/testutils"

# Create test utilities
cat > "${API_ROOT}/cmd/apitest/testutils/utils.go" << 'EOF'
package testutils

import (
    "bytes"
    "encoding/json"
    "net/http"
    "testing"
)

const BaseURL = "http://localhost:8080"

type TestCase struct {
    Name           string
    Method         string
    Path           string
    Body           interface{}
    Token          string
    ExpectedStatus int
    ExpectedBody   string
}

func RunTestCase(t *testing.T, tc TestCase) {
    var reqBody []byte
    var err error

    if tc.Body != nil {
        reqBody, err = json.Marshal(tc.Body)
        if err != nil {
            t.Fatalf("Failed to marshal request body: %v", err)
        }
    }

    req, err := http.NewRequest(tc.Method, BaseURL+tc.Path, bytes.NewBuffer(reqBody))
    if err != nil {
        t.Fatalf("Failed to create request: %v", err)
    }

    if tc.Body != nil {
        req.Header.Set("Content-Type", "application/json")
    }
    if tc.Token != "" {
        req.Header.Set("Authorization", "Bearer "+tc.Token)
    }

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        t.Fatalf("Request failed: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != tc.ExpectedStatus {
        t.Errorf("Expected status %d, got %d", tc.ExpectedStatus, resp.StatusCode)
    }

    // TODO: Add body comparison if needed
}

func GetAuthToken(t *testing.T, email, password string) string {
    loginData := map[string]string{
        "email":    email,
        "password": password,
    }

    reqBody, _ := json.Marshal(loginData)
    resp, err := http.Post(BaseURL+"/login", "application/json", bytes.NewBuffer(reqBody))
    if err != nil {
        t.Fatalf("Login request failed: %v", err)
    }
    defer resp.Body.Close()

    var result struct {
        Token string `json:"token"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        t.Fatalf("Failed to decode login response: %v", err)
    }

    return result.Token
}
EOF

# Create test module file
cat > "${API_ROOT}/cmd/apitest/go.mod" << EOF
module api/cmd/apitest

go 1.21
EOF

# Create main test file
cat > "${API_ROOT}/cmd/apitest/main_test.go" << 'EOF'
package main_test

import (
    "net/http"
    "testing"
    "time"
    "api/cmd/apitest/testutils"
)

func TestAPI(t *testing.T) {
    // Wait for API to be ready
    time.Sleep(2 * time.Second)

    // Test Authentication
    t.Run("Authentication", func(t *testing.T) {
        // Register tests
        registerTests := []testutils.TestCase{
            {
                Name:           "Register New User",
                Method:         "POST",
                Path:          "/register",
                Body:          map[string]string{"email": "test@example.com", "password": "test123456", "name": "Test User"},
                ExpectedStatus: http.StatusCreated,
            },
            {
                Name:           "Register Duplicate User",
                Method:         "POST",
                Path:          "/register",
                Body:          map[string]string{"email": "test@example.com", "password": "test123456", "name": "Test User"},
                ExpectedStatus: http.StatusBadRequest,
            },
            {
                Name:           "Register Invalid Email",
                Method:         "POST",
                Path:          "/register",
                Body:          map[string]string{"email": "invalid", "password": "test123456", "name": "Test User"},
                ExpectedStatus: http.StatusBadRequest,
            },
        }

        for _, tc := range registerTests {
            t.Run(tc.Name, func(t *testing.T) {
                testutils.RunTestCase(t, tc)
            })
        }

        // Login tests
        loginTests := []testutils.TestCase{
            {
                Name:           "Valid Login",
                Method:         "POST",
                Path:          "/login",
                Body:          map[string]string{"email": "test@example.com", "password": "test123456"},
                ExpectedStatus: http.StatusOK,
            },
            {
                Name:           "Invalid Password",
                Method:         "POST",
                Path:          "/login",
                Body:          map[string]string{"email": "test@example.com", "password": "wrong"},
                ExpectedStatus: http.StatusUnauthorized,
            },
            {
                Name:           "Non-existent User",
                Method:         "POST",
                Path:          "/login",
                Body:          map[string]string{"email": "nonexistent@example.com", "password": "test123456"},
                ExpectedStatus: http.StatusUnauthorized,
            },
        }

        for _, tc := range loginTests {
            t.Run(tc.Name, func(t *testing.T) {
                testutils.RunTestCase(t, tc)
            })
        }
    })

    // Get auth token for protected routes
    token := testutils.GetAuthToken(t, "test@example.com", "test123456")

    // Test Projects
    t.Run("Projects", func(t *testing.T) {
        projectTests := []testutils.TestCase{
            {
                Name:           "Create Project Without Auth",
                Method:         "POST",
                Path:          "/projects",
                Body:          map[string]string{"name": "Test Project", "status": "active", "visibility": "private"},
                ExpectedStatus: http.StatusUnauthorized,
            },
            {
                Name:           "Create Project With Auth",
                Method:         "POST",
                Path:          "/projects",
                Body:          map[string]string{"name": "Test Project", "status": "active", "visibility": "private"},
                Token:         token,
                ExpectedStatus: http.StatusCreated,
            },
            {
                Name:           "Get Non-existent Project",
                Method:         "GET",
                Path:          "/projects/999",
                Token:         token,
                ExpectedStatus: http.StatusNotFound,
            },
            {
                Name:           "Get Projects List",
                Method:         "GET",
                Path:          "/projects",
                Token:         token,
                ExpectedStatus: http.StatusOK,
            },
            {
                Name:           "Get Projects List Without Auth",
                Method:         "GET",
                Path:          "/projects",
                ExpectedStatus: http.StatusUnauthorized,
            },
        }

        for _, tc := range projectTests {
            t.Run(tc.Name, func(t *testing.T) {
                testutils.RunTestCase(t, tc)
            })
        }
    })

    // Test Modules
    t.Run("Modules", func(t *testing.T) {
        moduleTests := []testutils.TestCase{
            {
                Name:           "Create Module Without Auth",
                Method:         "POST",
                Path:          "/projects/1/modules",
                Body:          map[string]interface{}{"name": "Test Module", "status": "active", "visibility": "private"},
                ExpectedStatus: http.StatusUnauthorized,
            },
            {
                Name:           "Create Module With Auth",
                Method:         "POST",
                Path:          "/projects/1/modules",
                Body:          map[string]interface{}{
                    "name": "Test Module",
                    "status": "active",
                    "visibility": "private",
                    "technology_id": 1,
                    "language_id": 1,
                    "framework_id": 1,
                    "network_id": 1,
                    "mock_set_id": 1,
                },
                Token:         token,
                ExpectedStatus: http.StatusCreated,
            },
            {
                Name:           "Get Non-existent Module",
                Method:         "GET",
                Path:          "/projects/1/modules/999",
                Token:         token,
                ExpectedStatus: http.StatusNotFound,
            },
            {
                Name:           "Invalid Route",
                Method:         "GET",
                Path:          "/invalid/route",
                Token:         token,
                ExpectedStatus: http.StatusNotFound,
            },
        }

        for _, tc := range moduleTests {
            t.Run(tc.Name, func(t *testing.T) {
                testutils.RunTestCase(t, tc)
            })
        }
    })
}
EOF

# Create the test script
cat > "${API_ROOT}/scripts/test.sh" << 'EOF'
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
EOF

# Make scripts executable
chmod +x "${API_ROOT}/scripts/test.sh"

echo -e "${GREEN}Setup completed successfully${NC}"
echo "You can now run the tests with: ./scripts/test.sh"