package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "log"
)

const baseURL = "http://localhost:8080"

// Response structures
type TokenResponse struct {
    Token string `json:"token"`
}

type ErrorResponse struct {
    Error string `json:"error"`
}

type Project struct {
    ID          uint   `json:"id"`
    Name        string `json:"name"`
    Description string `json:"description"`
    Status      string `json:"status"`
    Visibility  string `json:"visibility"`
    UserID      uint   `json:"user_id"`
}

type Module struct {
    ID           uint   `json:"id"`
    ProjectID    uint   `json:"project_id"`
    Name         string `json:"name"`
    Description  string `json:"description"`
    Status       string `json:"status"`
    Visibility   string `json:"visibility"`
    TechnologyID uint   `json:"technology_id"`
    LanguageID   uint   `json:"language_id"`
    FrameworkID  uint   `json:"framework_id"`
    NetworkID    uint   `json:"network_id"`
    MockSetID    uint   `json:"mock_set_id"`
}

func main() {
    // Test user credentials
    email := "test@example.com"
    password := "test123456"
    name := "Test User"

    // 1. Register User (ignore error if exists)
    fmt.Println("\n=== Registering User ===")
    registerData := map[string]string{
        "email":    email,
        "password": password,
        "name":     name,
    }
    registerUser(registerData)

    // 2. Login
    fmt.Println("\n=== Logging In ===")
    token := login(email, password)
    fmt.Printf("Received token: %s\n", token)

    // Clean up any existing projects for this user
    fmt.Println("\n=== Cleaning Up Existing Projects ===")
    cleanupProjects(token)

    // 3. Create Project
    fmt.Println("\n=== Creating Project ===")
    projectData := map[string]string{
        "name":        "Test Project",
        "description": "This is a test project",
        "status":      "active",
        "visibility":  "private",
        "ado_id":     "TEST-123",
    }
    projectID := createProject(projectData, token)
    fmt.Printf("Created project with ID: %d\n", projectID)

    // 4. Verify and Create Module
    fmt.Println("\n=== Verifying Project Before Module Creation ===")
    verifyProject(projectID, token)

    fmt.Println("\n=== Creating Module ===")
    moduleData := map[string]interface{}{
        "name":           "Test Module",
        "description":    "This is a test module",
        "repository_url": "https://github.com/test/repo",
        "status":        "active",
        "visibility":    "private",
        "technology_id": 1,
        "language_id":   1,
        "framework_id":  1,
        "network_id":    1,
        "mock_set_id":   1,
    }
    createModule(moduleData, projectID, token)
}

func registerUser(data map[string]string) {
    resp := makeRequest("POST", "/register", data, "")
    printResponse("Register User", resp)
}

func login(email, password string) string {
    loginData := map[string]string{
        "email":    email,
        "password": password,
    }
    resp := makeRequest("POST", "/login", loginData, "")
    
    var tokenResp TokenResponse
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatalf("Failed to read response body: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        log.Fatalf("Login failed with status %d: %s", resp.StatusCode, string(body))
    }

    if err := json.Unmarshal(body, &tokenResp); err != nil {
        log.Fatalf("Failed to decode token response: %v\nBody: %s", err, string(body))
    }
    return tokenResp.Token
}

func cleanupProjects(token string) {
    // Get list of projects
    resp := makeRequest("GET", "/projects", nil, token)
    body, _ := ioutil.ReadAll(resp.Body)
    resp.Body.Close()

    var projectResp struct {
        Data []Project `json:"data"`
    }
    if err := json.Unmarshal(body, &projectResp); err != nil {
        log.Printf("Failed to decode projects list: %v", err)
        return
    }

    // Delete each project
    for _, project := range projectResp.Data {
        endpoint := fmt.Sprintf("/projects/%d", project.ID)
        resp := makeRequest("DELETE", endpoint, nil, token)
        fmt.Printf("Deleted project %d: Status %d\n", project.ID, resp.StatusCode)
        resp.Body.Close()
    }
}

func verifyProject(projectID uint, token string) {
    endpoint := fmt.Sprintf("/projects/%d", projectID)
    resp := makeRequest("GET", endpoint, nil, token)
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Printf("Project verification response (Status %d):\n%s\n", resp.StatusCode, string(body))
    resp.Body.Close()
}

func createProject(data map[string]string, token string) uint {
    resp := makeRequest("POST", "/projects", data, token)
    
    var project Project
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatalf("Failed to read response body: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusCreated {
        log.Fatalf("Create project failed with status %d: %s", resp.StatusCode, string(body))
    }

    if err := json.Unmarshal(body, &project); err != nil {
        log.Fatalf("Failed to decode project response: %v\nBody: %s", err, string(body))
    }

    fmt.Printf("Project created successfully: %+v\n", project)
    return project.ID
}

func createModule(data map[string]interface{}, projectID uint, token string) {
    endpoint := fmt.Sprintf("/projects/%d/modules", projectID)
    resp := makeRequest("POST", endpoint, data, token)
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatalf("Failed to read response body: %v", err)
    }
    defer resp.Body.Close()

    fmt.Printf("Raw module creation response: %s\n", string(body))

    if resp.StatusCode != http.StatusCreated {
        var errResp ErrorResponse
        if err := json.Unmarshal(body, &errResp); err != nil {
            log.Printf("Failed to decode error response: %v", err)
        }
        log.Printf("Create module failed with status %d: %s", resp.StatusCode, string(body))
        log.Printf("Error response: %+v", errResp)
        return
    }

    var module Module
    if err := json.Unmarshal(body, &module); err != nil {
        log.Printf("Failed to decode module response: %v\nBody: %s", err, string(body))
        return
    }

    fmt.Printf("Module created successfully: %+v\n", module)
}

func makeRequest(method, endpoint string, data interface{}, token string) *http.Response {
    var req *http.Request
    var err error

    if data != nil {
        jsonData, err := json.Marshal(data)
        if err != nil {
            log.Fatalf("Failed to marshal JSON: %v", err)
        }
        fmt.Printf("Making %s request to %s\nData: %s\n", method, endpoint, string(jsonData))
        req, err = http.NewRequest(method, baseURL+endpoint, bytes.NewBuffer(jsonData))
    } else {
        fmt.Printf("Making %s request to %s\n", method, endpoint)
        req, err = http.NewRequest(method, baseURL+endpoint, nil)
    }

    if err != nil {
        log.Fatalf("Failed to create request: %v", err)
    }

    if data != nil {
        req.Header.Set("Content-Type", "application/json")
    }
    if token != "" {
        req.Header.Set("Authorization", "Bearer "+token)
    }

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        log.Fatalf("Request failed: %v", err)
    }

    return resp
}

func printResponse(operation string, resp *http.Response) {
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatalf("Failed to read response body: %v", err)
    }
    defer resp.Body.Close()

    fmt.Printf("%s Response (Status %d):\n%s\n", operation, resp.StatusCode, string(body))
}