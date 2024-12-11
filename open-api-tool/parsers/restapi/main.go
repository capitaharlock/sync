// main.go
package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

const (
    tempDir    = "./temp"
    outputDir  = "./output"
    outputFile = "openapi.json"
)

func main() {
    repoPath := flag.String("path", "", "Path to the Go repository to analyze")
    flag.Parse()

    if *repoPath == "" {
        log.Fatal("Please provide a repository path using -path flag")
    }

    // Verify repository path exists
    if _, err := os.Stat(*repoPath); os.IsNotExist(err) {
        log.Fatalf("Repository path does not exist: %s", *repoPath)
    }

    // Create or clean temp directory
    os.RemoveAll(tempDir)
    if err := os.MkdirAll(tempDir, 0755); err != nil {
        log.Fatalf("Failed to create temp directory: %v", err)
    }
    defer os.RemoveAll(tempDir)

    // Create output directory if it doesn't exist
    if err := os.MkdirAll(outputDir, 0755); err != nil {
        log.Fatalf("Failed to create output directory: %v", err)
    }

    // Copy repository files to temp directory
    log.Println("Copying repository files...")
    if err := copyDirectory(*repoPath, tempDir); err != nil {
        log.Fatalf("Failed to copy repository: %v", err)
    }

    // Run swag init
    log.Println("Generating OpenAPI documentation...")
    cmd := exec.Command("swag", "init", "--parseDependency", "--parseInternal")
    cmd.Dir = tempDir
    if output, err := cmd.CombinedOutput(); err != nil {
        log.Fatalf("swag init failed: %v\nOutput: %s", err, output)
    }

    // Copy generated swagger.json to output location
    swaggerFile := filepath.Join(tempDir, "docs", "swagger.json")
    finalOutput := filepath.Join(outputDir, outputFile)
    
    log.Println("Copying generated documentation...")
    if err := copyFile(swaggerFile, finalOutput); err != nil {
        log.Fatalf("Failed to copy generated documentation: %v", err)
    }

    fmt.Printf("Successfully generated OpenAPI documentation at: %s\n", finalOutput)
}

// copyDirectory copies a directory recursively
func copyDirectory(src, dst string) error {
    src = filepath.Clean(src)
    dst = filepath.Clean(dst)

    return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
        if err != nil {
            return err
        }

        // Get the relative path
        relPath, err := filepath.Rel(src, path)
        if err != nil {
            return err
        }

        // Skip if it's the root source directory
        if relPath == "." {
            return nil
        }

        // Create the destination path
        dstPath := filepath.Join(dst, relPath)

        // If it's a directory, create it
        if info.IsDir() {
            return os.MkdirAll(dstPath, info.Mode())
        }

        // Copy the file
        return copyFile(path, dstPath)
    })
}

// copyFile copies a single file
func copyFile(src, dst string) error {
    sourceFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer sourceFile.Close()

    // Create the destination directory if it doesn't exist
    dstDir := filepath.Dir(dst)
    if err := os.MkdirAll(dstDir, 0755); err != nil {
        return err
    }

    destFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer destFile.Close()

    _, err = io.Copy(destFile, sourceFile)
    return err
}