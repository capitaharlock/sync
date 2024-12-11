package services

import (
    "errors"
    "api/internal/models"
    "api/internal/repository"
    "api/internal/utils"
)

type UserService struct {
    repo *repository.UserRepository
    jwtSecret string
}

func NewUserService(repo *repository.UserRepository, jwtSecret string) *UserService {
    return &UserService{
        repo: repo,
        jwtSecret: jwtSecret,
    }
}

func (s *UserService) Register(user *models.User) error {
    hashedPassword, err := utils.HashPassword(user.Password)
    if err != nil {
        return err
    }
    user.Password = hashedPassword
    return s.repo.Create(user)
}

func (s *UserService) Login(email, password string) (string, error) {
    user, err := s.repo.FindByEmail(email)
    if err != nil {
        return "", errors.New("invalid credentials")
    }

    if !utils.CheckPassword(password, user.Password) {
        return "", errors.New("invalid credentials")
    }

    return utils.GenerateJWT(user.ID, s.jwtSecret)
}

func (s *UserService) RecoverPassword(email string) error {
    _, err := s.repo.FindByEmail(email)
    if err != nil {
        return err
    }
    return nil
}
