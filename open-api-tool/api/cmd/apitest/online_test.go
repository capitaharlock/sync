package online_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"testing"
	"time"
)

const (
	BaseURL = "https://scadot.api.proars.com"
)

type TestCase struct {
	Name           string
	Method         string
	Path           string
	Body           interface{}
	Token          string
	ExpectedStatus int
	Skip          bool
	Setup         func() interface{}
}

// Helper function to generate random string
func randomString(prefix string) string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%s_%d_%d", prefix, time.Now().Unix(), rand.Intn(10000))
}

func randomEmail() string {
	return fmt.Sprintf("test_%d_%d@example.com", time.Now().Unix(), rand.Intn(10000))
}

func runTestCase(t *testing.T, tc TestCase) {
	if tc.Skip {
		t.Logf("Skipping test: %s", tc.Name)
		return
	}

	var bodyReader io.Reader
	var body interface{}

	if tc.Setup != nil {
		body = tc.Setup()
	} else {
		body = tc.Body
	}

	if body != nil {
		bodyBytes, err := json.Marshal(body)
		if err != nil {
			t.Fatalf("Failed to marshal body: %v", err)
		}
		bodyReader = bytes.NewReader(bodyBytes)
	}

	req, err := http.NewRequest(tc.Method, BaseURL+tc.Path, bodyReader)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if tc.Token != "" {
		req.Header.Set("Authorization", "Bearer "+tc.Token)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != tc.ExpectedStatus {
		t.Errorf("%s: Expected status %d, got %d. Response: %s", tc.Name, tc.ExpectedStatus, resp.StatusCode, string(respBody))
	} else {
		t.Logf("%s: OK (Status: %d)", tc.Name, resp.StatusCode)
		if len(respBody) > 0 {
			t.Logf("Response: %s", string(respBody))
		}
	}
}

func getAuthToken(t *testing.T, email, password string) string {
	body := map[string]string{
		"email":    email,
		"password": password,
	}
	bodyBytes, _ := json.Marshal(body)

	resp, err := http.Post(BaseURL+"/login", "application/json", bytes.NewReader(bodyBytes))
	if err != nil {
		t.Fatalf("Failed to get auth token: %v", err)
	}
	defer resp.Body.Close()

	var result struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("Failed to decode auth response: %v", err)
	}
	return result.Token
}

func TestComprehensiveAPI(t *testing.T) {
	fmt.Printf("Starting comprehensive API tests at: %s\n", BaseURL)

	// Generate random test data
	testEmail := randomEmail()
	testPassword := randomString("pwd")
	testName := randomString("user")
	
	// Test Authentication
	t.Run("Authentication", func(t *testing.T) {
		// Register tests
		registerTests := []TestCase{
			{
				Name:   "Register New User",
				Method: "POST",
				Path:   "/register",
				Body: map[string]string{
					"email":    testEmail,
					"password": testPassword,
					"name":     testName,
				},
				ExpectedStatus: http.StatusCreated,
			},
			{
				Name:   "Register With Invalid Email",
				Method: "POST",
				Path:   "/register",
				Body: map[string]string{
					"email":    "invalid-email",
					"password": testPassword,
					"name":     testName,
				},
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:   "Register With Short Password",
				Method: "POST",
				Path:   "/register",
				Body: map[string]string{
					"email":    randomEmail(),
					"password": "short",
					"name":     testName,
				},
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:   "Register Without Name",
				Method: "POST",
				Path:   "/register",
				Body: map[string]string{
					"email":    randomEmail(),
					"password": testPassword,
				},
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:   "Register Duplicate User",
				Method: "POST",
				Path:   "/register",
				Body: map[string]string{
					"email":    testEmail,
					"password": testPassword,
					"name":     testName,
				},
				ExpectedStatus: http.StatusBadRequest,
			},
		}

		for _, tc := range registerTests {
			runTestCase(t, tc)
		}

		// Login tests
		loginTests := []TestCase{
			{
				Name:   "Valid Login",
				Method: "POST",
				Path:   "/login",
				Body: map[string]string{
					"email":    testEmail,
					"password": testPassword,
				},
				ExpectedStatus: http.StatusOK,
			},
			{
				Name:   "Login With Invalid Email Format",
				Method: "POST",
				Path:   "/login",
				Body: map[string]string{
					"email":    "invalid-email",
					"password": testPassword,
				},
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:   "Login With Wrong Password",
				Method: "POST",
				Path:   "/login",
				Body: map[string]string{
					"email":    testEmail,
					"password": "wrongpassword",
				},
				ExpectedStatus: http.StatusUnauthorized,
			},
			{
				Name:   "Login With Non-existent User",
				Method: "POST",
				Path:   "/login",
				Body: map[string]string{
					"email":    "nonexistent@example.com",
					"password": testPassword,
				},
				ExpectedStatus: http.StatusUnauthorized,
			},
		}

		for _, tc := range loginTests {
			runTestCase(t, tc)
		}
	})

	// Get auth token for protected routes
	token := getAuthToken(t, testEmail, testPassword)

	// Test Projects
	t.Run("Projects", func(t *testing.T) {

		projectTests := []TestCase{
			{
				Name:   "Create Project Without Auth",
				Method: "POST",
				Path:   "/projects",
				Body: map[string]string{
					"name":       randomString("project"),
					"status":     "active",
					"visibility": "private",
				},
				ExpectedStatus: http.StatusUnauthorized,
			},
			{
				Name:   "Create Project With Auth",
				Method: "POST",
				Path:   "/projects",
				Body: map[string]string{
					"name":        randomString("project"),
					"description": "Test project description",
					"status":      "active",
					"visibility":  "private",
				},
				Token:         token,
				ExpectedStatus: http.StatusCreated,
			},
			{
				Name:   "Create Project With Invalid Status",
				Method: "POST",
				Path:   "/projects",
				Body: map[string]string{
					"name":       randomString("project"),
					"status":     "invalid_status",
					"visibility": "private",
				},
				Token:         token,
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:   "Get Projects List With Pagination",
				Method: "GET",
				Path:   "/projects?page=1&limit=10",
				Token:  token,
				ExpectedStatus: http.StatusOK,
			},
			{
				Name:   "Get Non-existent Project",
				Method: "GET",
				Path:   "/projects/99999",
				Token:  token,
				ExpectedStatus: http.StatusNotFound,
			},
			{
				Name:   "Get Projects Without Auth",
				Method: "GET",
				Path:   "/projects",
				ExpectedStatus: http.StatusUnauthorized,
			},
		}

		for _, tc := range projectTests {
			runTestCase(t, tc)
		}
	})

	// Test Modules
	t.Run("Modules", func(t *testing.T) {
		moduleTests := []TestCase{
			{
				Name:   "Create Module Without Auth",
				Method: "POST",
				Path:   "/projects/1/modules",
				Body: map[string]interface{}{
					"name":       randomString("module"),
					"status":     "active",
					"visibility": "private",
				},
				ExpectedStatus: http.StatusUnauthorized,
			},
			{
				Name:   "Create Module With Auth",
				Method: "POST",
				Path:   "/projects/1/modules",
				Body: map[string]interface{}{
					"name":          randomString("module"),
					"description":   "Test module description",
					"status":        "active",
					"visibility":    "private",
					"technology_id": 1,
					"language_id":   1,
					"framework_id":  1,
					"network_id":    1,
					"mock_set_id":   1,
				},
				Token:         token,
				ExpectedStatus: http.StatusCreated,
			},
			{
				Name:   "Create Module With Invalid Status",
				Method: "POST",
				Path:   "/projects/1/modules",
				Body: map[string]interface{}{
					"name":       randomString("module"),
					"status":     "invalid_status",
					"visibility": "private",
				},
				Token:         token,
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:           "Get Module From Non-existent Project",
				Method:         "GET",
				Path:          "/projects/99999/modules/1",
				Token:         token,
				ExpectedStatus: http.StatusNotFound,
			},
			{
				Name:           "Get Non-existent Module",
				Method:         "GET",
				Path:          "/projects/1/modules/99999",
				Token:         token,
				ExpectedStatus: http.StatusNotFound,
			},
			{
				Name:   "Update Module",
				Method: "PUT",
				Path:   "/projects/1/modules/1",
				Body: map[string]interface{}{
					"name":        randomString("module"),
					"status":      "inactive",
					"visibility":  "public",
				},
				Token:         token,
				ExpectedStatus: http.StatusOK,
			},
			{
				Name:           "Delete Non-existent Module",
				Method:         "DELETE",
				Path:          "/projects/1/modules/99999",
				Token:         token,
				ExpectedStatus: http.StatusNotFound,
			},
		}

		for _, tc := range moduleTests {
			runTestCase(t, tc)
		}
	})

	// Test Error Cases
	t.Run("ErrorCases", func(t *testing.T) {
		errorTests := []TestCase{
			{
				Name:           "Invalid URL",
				Method:         "GET",
				Path:          "/invalid/path",
				Token:         token,
				ExpectedStatus: http.StatusNotFound,
			},
			{
				Name:           "Invalid Method",
				Method:         "PATCH",
				Path:          "/projects",
				Token:         token,
				ExpectedStatus: http.StatusMethodNotAllowed,
			},
			{
				Name:           "Invalid JSON",
				Method:         "POST",
				Path:          "/projects",
				Body:          "{invalid-json}",
				Token:         token,
				ExpectedStatus: http.StatusBadRequest,
			},
			{
				Name:           "Invalid Token",
				Method:         "GET",
				Path:          "/projects",
				Token:         "invalid_token",
				ExpectedStatus: http.StatusUnauthorized,
			},
		}

		for _, tc := range errorTests {
			runTestCase(t, tc)
		}
	})
}