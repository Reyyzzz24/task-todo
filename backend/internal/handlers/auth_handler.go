package handlers

import (
	"task-todo-app/internal/models"
	"task-todo-app/internal/repository"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Gunakan secret key yang aman (simpan di .env di proyek asli)
var jwtSecret = []byte("SUPER_SECRET_KEY_123")

type AuthHandler struct {
	Repo *repository.PostgresRepo
}

func (h *AuthHandler) generateToken(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  user.UUID,
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Login menangani proses autentikasi
func (h *AuthHandler) Login(c fiber.Ctx) error {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.Bind().JSON(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	var user models.User
	if err := h.Repo.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "User tidak ditemukan"})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Password salah"})
	}

	tokenString, err := h.generateToken(user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal membuat token"})
	}

	return c.JSON(fiber.Map{
		"message":  "Login berhasil",
		"token":    tokenString,
		"username": user.Username,
	})
}

func (h *AuthHandler) Register(c fiber.Ctx) error {
	var input struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.Bind().JSON(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	if input.Username == "" || input.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username dan password wajib diisi"})
	}

	var existing models.User
	if err := h.Repo.DB.Where("username = ?", input.Username).First(&existing).Error; err == nil {
		return c.Status(409).JSON(fiber.Map{"error": "Username sudah terdaftar"})
	} else if err != gorm.ErrRecordNotFound {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal memeriksa username"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal mengenkripsi password"})
	}

	user := models.User{
		UUID:     uuid.NewString(),
		Name:     input.Name,
		Username: input.Username,
		Password: string(hashedPassword),
	}

	if err := h.Repo.DB.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal mendaftarkan user"})
	}

	tokenString, err := h.generateToken(user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Gagal membuat token"})
	}

	return c.Status(201).JSON(fiber.Map{
		"message":  "Register berhasil",
		"token":    tokenString,
		"username": user.Username,
	})
}
