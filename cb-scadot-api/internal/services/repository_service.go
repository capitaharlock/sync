package services

import (
	"api/internal/models"
	"api/internal/repository"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type RepositoryService struct {
	repo *repository.RepositoriesRepository
}

func NewRepositoryService(repo *repository.RepositoriesRepository) *RepositoryService {
	return &RepositoryService{repo: repo}
}

func (s *RepositoryService) GetRepositoryByModuleID(moduleID uint) (*models.Repository, error) {
	return s.repo.FindByModuleID(moduleID)
}

func (s *RepositoryService) SaveRepository(repository *models.Repository) error {
	return s.repo.CreateOrUpdate(repository)
}

func (s *RepositoryService) DeleteRepository(moduleID uint) error {
	return s.repo.DeleteByModuleID(moduleID)
}

func (s *RepositoryService) SyncRepository(moduleID uint) error {
	// Get the temporary directory from the environment variable
	tmpDir := os.Getenv("TMP_DIR")
	if tmpDir == "" {
		tmpDir = os.TempDir() // Fallback to the system's default temp directory
	}
	fmt.Printf("Temporary directory: %s\n", tmpDir)

	// Create a unique folder for this module
	repoDir := filepath.Join(tmpDir, fmt.Sprintf("repo-%d", moduleID))
	fmt.Printf("Repository directory: %s\n", repoDir)
	if err := os.MkdirAll(repoDir, 0755); err != nil {
		return fmt.Errorf("failed to create temporary directory: %v", err)
	}

	// Fetch repository data from the database
	repoData, err := s.repo.FindByModuleID(moduleID)
	if err != nil {
		return fmt.Errorf("failed to fetch repository data from DB: %v", err)
	}
	fmt.Printf("Repository data from DB: %+v\n", repoData)

	// Validate repository URL and access token
	if repoData.RepositoryURL == nil || *repoData.RepositoryURL == "" {
		return fmt.Errorf("repository URL is required")
	}
	if repoData.AccessToken == nil || *repoData.AccessToken == "" {
		return fmt.Errorf("access token is required")
	}

	// Construct the Git command with the access token
	repoURL := strings.TrimPrefix(*repoData.RepositoryURL, "https://")
	authRepoURL := fmt.Sprintf("https://%s@%s", *repoData.AccessToken, repoURL)
	fmt.Printf("Constructed Git URL: %s\n", authRepoURL)

	cmd := exec.Command("git", "clone", authRepoURL, repoDir)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// Run the Git command
	fmt.Println("Running Git clone command...")
	if err := cmd.Run(); err != nil {
		// Capture the full error output
		if ee, ok := err.(*exec.ExitError); ok {
			return fmt.Errorf("failed to clone repository: %v, output: %s", err, string(ee.Stderr))
		}
		return fmt.Errorf("failed to clone repository: %v", err)
	}

	fmt.Println("Repository cloned successfully")
	return nil
}
