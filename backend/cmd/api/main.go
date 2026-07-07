package main

import (
	"log"
	"os"
	"task-todo-app/internal/config"
	"task-todo-app/internal/handlers"
	"task-todo-app/internal/middleware"
	"task-todo-app/internal/models"
	"task-todo-app/internal/repository"
	"task-todo-app/internal/service"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Setup env
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Setup Database
	db, err := config.ConnectPostgres()
	if err != nil {
		log.Fatal("Could not connect to Postgres:", err)
	}

	mongoDB, err := config.ConnectMongo()
	if err != nil {
		log.Println("Warning: Could not connect to MongoDB:", err)
	} else {
		middleware.LogCollection = mongoDB.Collection("audit_logs")
	}

	db.AutoMigrate(&models.User{}, &models.Position{}, &models.UserPosition{}, &models.Task{})

	// Dependency Injection
	repo := repository.NewPostgresRepo(db)

	// Setup App
	app := fiber.New()
	app.Use(cors.New())
	app.Use(middleware.AuditLogMiddleware)

	// Routing
	setupRoutes(app, repo)

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Fatal(app.Listen(":" + port))
}

func setupRoutes(app *fiber.App, repo *repository.PostgresRepo) {
	// Handlers
	authH := &handlers.AuthHandler{Repo: repo}
	taskH := &handlers.TaskHandler{Service: &service.TaskService{TaskRepo: repo}}
	posH := &handlers.PositionHandler{Service: &service.PositionService{Repo: repo}}
	userH := &handlers.UserHandler{Repo: repo}
	upH := &handlers.UserPositionHandler{Repo: repo}

	// Public
	app.Post("/login", authH.Login)
	app.Post("/register", authH.Register)
	app.Get("/ping", func(c fiber.Ctx) error {
		return c.SendString("pong")
	})

	// Protected
	api := app.Group("/api", middleware.AuthMiddleware)

	registerCRUD(api, "/tasks", taskH.CreateTask, taskH.GetAllTasks, taskH.GetTaskByID, taskH.UpdateTask, taskH.DeleteTask)
	registerCRUD(api, "/positions", posH.CreatePosition, posH.GetAllPositions, posH.GetPositionByID, posH.UpdatePosition, posH.DeletePosition)
	registerCRUD(api, "/users", userH.CreateUser, userH.GetAllUsers, userH.GetUserByID, userH.UpdateUser, userH.DeleteUser)
	registerCRUD(api, "/user-positions", upH.CreateUserPosition, upH.GetAllUserPositions, upH.GetUserPositionByID, upH.UpdateUserPosition, upH.DeleteUserPosition)
}

// Helper untuk menyingkat kode route CRUD
func registerCRUD(api fiber.Router, path string, create, getAll, getByID, update, del fiber.Handler) {
	api.Post(path, create)
	api.Get(path, getAll)
	api.Get(path+"/:uuid", getByID)
	api.Put(path+"/:uuid", update)
	api.Delete(path+"/:uuid", del)
}
