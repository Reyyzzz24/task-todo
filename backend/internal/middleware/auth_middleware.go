package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

// Secret key yang sama dengan yang digunakan di AuthHandler
var jwtSecret = []byte("SUPER_SECRET_KEY_123")

func AuthMiddleware(c fiber.Ctx) error {
	// 1. Ambil header Authorization
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Missing or malformed JWT"})
	}

	// 2. Format header adalah "Bearer <token>"
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid authorization format"})
	}

	tokenString := parts[1]

	// 3. Validasi Token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid or expired token"})
	}

	// 4. (Opsional) Simpan user_id ke dalam context jika dibutuhkan handler
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		c.Locals("user_id", claims["user_id"])
		c.Locals("username", claims["username"])
	}

	return c.Next()
}
