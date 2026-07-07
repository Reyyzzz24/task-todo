package handlers

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/repository"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type UserPositionHandler struct {
	Repo *repository.PostgresRepo
}

func (h *UserPositionHandler) CreateUserPosition(c fiber.Ctx) error {
	userPosition := new(models.UserPosition)
	if err := c.Bind().JSON(userPosition); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	if userPosition.UUID == "" {
		userPosition.UUID = uuid.NewString()
	}

	if err := h.Repo.CreateUserPosition(userPosition); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user position"})
	}
	return c.Status(201).JSON(userPosition)
}

func (h *UserPositionHandler) GetAllUserPositions(c fiber.Ctx) error {
	userPositions, err := h.Repo.GetAllUserPositions()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch user positions"})
	}
	return c.Status(200).JSON(userPositions)
}

func (h *UserPositionHandler) GetUserPositionByID(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	userPosition, err := h.Repo.GetUserPositionByID(uuid)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "UserPosition not found"})
	}
	return c.Status(200).JSON(userPosition)
}

func (h *UserPositionHandler) UpdateUserPosition(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	userPosition := new(models.UserPosition)
	if err := c.Bind().JSON(userPosition); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}
	userPosition.UUID = uuid
	if err := h.Repo.UpdateUserPosition(userPosition); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update user position"})
	}
	return c.Status(200).JSON(userPosition)
}

func (h *UserPositionHandler) DeleteUserPosition(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	if err := h.Repo.DeleteUserPosition(uuid); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete user position"})
	}
	return c.Status(200).JSON(fiber.Map{"message": "UserPosition deleted"})
}
