package handlers

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/service"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type PositionHandler struct {
	Service *service.PositionService
}

func (h *PositionHandler) CreatePosition(c fiber.Ctx) error {
	position := new(models.Position)
	if err := c.Bind().JSON(position); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	if position.UUID == "" {
		position.UUID = uuid.NewString()
	}

	if err := h.Service.CreatePosition(position); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create position"})
	}

	return c.Status(201).JSON(position)
}

func (h *PositionHandler) GetAllPositions(c fiber.Ctx) error {
	positions, err := h.Service.GetAllPositions()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch positions"})
	}

	return c.Status(200).JSON(positions)
}

func (h *PositionHandler) GetPositionByID(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	position, err := h.Service.GetPositionByID(uuid)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Position not found"})
	}
	return c.Status(200).JSON(position)
}

func (h *PositionHandler) UpdatePosition(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	position := new(models.Position)
	if err := c.Bind().JSON(position); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}
	position.UUID = uuid
	if err := h.Service.UpdatePosition(position); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update position"})
	}
	return c.Status(200).JSON(position)
}

func (h *PositionHandler) DeletePosition(c fiber.Ctx) error {
	uuid := c.Params("uuid")
	if err := h.Service.DeletePosition(uuid); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete position"})
	}
	return c.Status(200).JSON(fiber.Map{"message": "Position deleted"})
}
