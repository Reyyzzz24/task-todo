package service

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/repository"
)

type TaskService struct {
	TaskRepo  *repository.PostgresRepo
	AuditRepo *repository.MongoRepo
}

func (s *TaskService) CreateTask(task *models.Task) error {
	if s.TaskRepo == nil {
		return nil
	}
	if err := s.TaskRepo.CreateTask(task); err != nil {
		return err
	}
	if s.AuditRepo != nil && task.UUID != "" {
		s.AuditRepo.LogAction("CREATE", "Task", task.UUID)
	}
	return nil
}

func (s *TaskService) GetAllTasks() ([]models.Task, error) {
	return s.TaskRepo.GetAllTasks()
}

func (s *TaskService) GetTaskByID(uuid string) (*models.Task, error) {
	return s.TaskRepo.GetTaskByID(uuid)
}

func (s *TaskService) UpdateTask(task *models.Task) error {
	return s.TaskRepo.UpdateTask(task)
}

func (s *TaskService) DeleteTask(uuid string) error {
	return s.TaskRepo.DeleteTask(uuid)
}
