package service

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/repository"
)

type PositionService struct {
	Repo *repository.PostgresRepo
}

func (s *PositionService) CreatePosition(position *models.Position) error {
	return s.Repo.CreatePosition(position)
}

func (s *PositionService) GetAllPositions() ([]models.Position, error) {
	return s.Repo.GetAllPositions()
}

func (s *PositionService) GetPositionByID(uuid string) (*models.Position, error) {
	return s.Repo.GetPositionByID(uuid)
}

func (s *PositionService) UpdatePosition(position *models.Position) error {
	return s.Repo.UpdatePosition(position)
}

func (s *PositionService) DeletePosition(uuid string) error {
	return s.Repo.DeletePosition(uuid)
}
