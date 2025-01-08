package testutils

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
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

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        t.Fatalf("Failed to read response body: %v", err)
    }

    if resp.StatusCode != tc.ExpectedStatus {
        t.Errorf("\nRequest: %s %s\nRequest Body: %s\nExpected Status: %d\nGot Status: %d\nResponse Body: %s", 
            tc.Method, tc.Path, string(reqBody), tc.ExpectedStatus, resp.StatusCode, string(body))
    }

    if tc.ExpectedBody != "" && string(body) != tc.ExpectedBody {
        t.Errorf("Expected body %s, got %s", tc.ExpectedBody, string(body))
    }
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

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        t.Fatalf("Failed to read response body: %v", err)
    }

    var result struct {
        Token string `json:"token"`
    }
    if err := json.NewDecoder(bytes.NewReader(body)).Decode(&result); err != nil {
        t.Fatalf("Failed to decode login response: %v\nBody: %s", err, string(body))
    }

    if result.Token == "" {
        t.Fatalf("No token in response: %s", string(body))
    }

    return result.Token
}