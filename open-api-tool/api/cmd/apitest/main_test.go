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
