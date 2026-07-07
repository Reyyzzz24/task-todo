package middleware

import (
	"context"
	"log"
	"time"

	"github.com/gofiber/fiber/v3"
	"go.mongodb.org/mongo-driver/mongo"
)

// Pastikan DB Mongo diinjeksi ke sini atau didefinisikan global
var LogCollection *mongo.Collection

func AuditLogMiddleware(c fiber.Ctx) error {
	err := c.Next()

	// Cek apakah collection sudah diinisialisasi
	if LogCollection == nil {
		log.Println("AuditLog: LogCollection belum diinisialisasi!")
		return err
	}

	logData := fiber.Map{
		"user_id":   c.Locals("user_id"),
		"method":    c.Method(),
		"path":      c.Path(),
		"status":    c.Response().StatusCode(),
		"timestamp": time.Now(),
	}

	// Gunakan context yang benar
	go func(data fiber.Map) {
		_, insertErr := LogCollection.InsertOne(context.Background(), data)
		if insertErr != nil {
			log.Printf("Gagal insert log ke Mongo: %v\n", insertErr)
		}
	}(logData)

	return err
}
