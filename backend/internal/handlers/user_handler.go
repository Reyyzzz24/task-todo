package handlers

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/repository"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	Repo *repository.PostgresRepo
}

type userInput struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func (h *UserHandler) CreateUser(c fiber.Ctx) error {
	var input userInput
	if err := c.Bind().JSON(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	if input.Username == "" || input.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username dan password wajib diisi"})
	}

	hashedPassword, err := hashPassword(input.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal mengenkripsi password"})
	}

	user := models.User{
		UUID:     uuid.NewString(),
		Name:     input.Name,
		Username: input.Username,
		Password: hashedPassword,
	}

	if err := h.Repo.CreateUser(&user); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user"})
	}
	return c.Status(201).JSON(user)
}

func (h *UserHandler) GetAllUsers(c fiber.Ctx) error {
	users, err := h.Repo.GetAllUsers()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch users"})
	}
	return c.Status(200).JSON(users)
}

func (h *UserHandler) GetUserByID(c fiber.Ctx) error {
	uuidParam := c.Params("uuid")
	user, err := h.Repo.GetUserByID(uuidParam)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	return c.Status(200).JSON(user)
}

func (h *UserHandler) UpdateUser(c fiber.Ctx) error {
	uuidParam := c.Params("uuid")

	existing, err := h.Repo.GetUserByID(uuidParam)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	var input userInput
	if err := c.Bind().JSON(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	existing.Name = input.Name
	existing.Username = input.Username

	if input.Password != "" {
		hashedPassword, err := hashPassword(input.Password)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Gagal mengenkripsi password"})
		}
		existing.Password = hashedPassword
	}

	if err := h.Repo.UpdateUser(existing); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update user"})
	}
	return c.Status(200).JSON(existing)
}

func (h *UserHandler) DeleteUser(c fiber.Ctx) error {
	uuidParam := c.Params("uuid")
	if err := h.Repo.DeleteUser(uuidParam); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete user"})
	}
	return c.Status(200).JSON(fiber.Map{"message": "User deleted"})
}
