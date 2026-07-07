package handlers

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/service"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type TaskHandler struct {
	Service *service.TaskService
}

func (h *TaskHandler) CreateTask(c fiber.Ctx) error {
	task := new(models.Task)
	if err := c.Bind().JSON(task); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	if task.UUID == "" {
		task.UUID = uuid.NewString()
	}
	if task.UserID == "" {
		if userID, ok := c.Locals("user_id").(string); ok && userID != "" {
			task.UserID = userID
		}
	}
	if task.StartDate.IsZero() {
		task.StartDate = time.Now()
	}
	if task.EndDate.IsZero() {
		task.EndDate = time.Now()
	}

	if err := h.Service.CreateTask(task); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create task"})
	}

	return c.Status(201).JSON(task)
}

func (h *TaskHandler) GetAllTasks(c fiber.Ctx) error {
	tasks, err := h.Service.GetAllTasks()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch tasks"})
	}
	return c.Status(200).JSON(tasks)
}

func (h *TaskHandler) GetTaskByID(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	task, err := h.Service.GetTaskByID(uuid)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}
	return c.Status(200).JSON(task)
}

func (h *TaskHandler) UpdateTask(c fiber.Ctx) error {
	uuidParam := c.Params("uuid")
	input := new(models.Task)
	if err := c.Bind().JSON(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	existing, err := h.Service.GetTaskByID(uuidParam)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Task not found"})
	}

	existing.Todo = input.Todo
	if !input.StartDate.IsZero() {
		existing.StartDate = input.StartDate
	}
	if !input.EndDate.IsZero() {
		existing.EndDate = input.EndDate
	}
	if existing.UserID == "" {
		if userID, ok := c.Locals("user_id").(string); ok && userID != "" {
			existing.UserID = userID
		}
	}

	if err := h.Service.UpdateTask(existing); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update task"})
	}
	return c.Status(200).JSON(existing)
}

func (h *TaskHandler) DeleteTask(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	if err := h.Service.DeleteTask(uuid); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete task"})
	}
	return c.Status(200).JSON(fiber.Map{"message": "Task deleted"})
}
