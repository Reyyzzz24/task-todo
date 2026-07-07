package repository

import (
	"task-todo-app/internal/models"

	"gorm.io/gorm"
)

type PostgresRepo struct {
	DB *gorm.DB
}

func NewPostgresRepo(db *gorm.DB) *PostgresRepo {
	return &PostgresRepo{DB: db}
}

// User methods
func (r *PostgresRepo) CreateUser(user *models.User) error {
	return r.DB.Create(user).Error
}

func (r *PostgresRepo) GetAllUsers() ([]models.User, error) {
	var users []models.User
	err := r.DB.Find(&users).Error
	return users, err
}

func (r *PostgresRepo) GetUserByID(uuid string) (*models.User, error) {
	var user models.User
	err := r.DB.Where("uuid = ?", uuid).First(&user).Error
	return &user, err
}

func (r *PostgresRepo) UpdateUser(user *models.User) error {
	return r.DB.Save(user).Error
}

func (r *PostgresRepo) DeleteUser(uuid string) error {
	return r.DB.Delete(&models.User{}, "uuid = ?", uuid).Error
}

// Position methods
func (r *PostgresRepo) CreatePosition(position *models.Position) error {
	return r.DB.Create(position).Error
}

func (r *PostgresRepo) GetAllPositions() ([]models.Position, error) {
	var positions []models.Position
	err := r.DB.Find(&positions).Error
	return positions, err
}

func (r *PostgresRepo) GetPositionByID(uuid string) (*models.Position, error) {
	var position models.Position
	err := r.DB.Where("uuid = ?", uuid).First(&position).Error
	return &position, err
}

func (r *PostgresRepo) UpdatePosition(position *models.Position) error {
	return r.DB.Save(position).Error
}

func (r *PostgresRepo) DeletePosition(uuid string) error {
	return r.DB.Delete(&models.Position{}, "uuid = ?", uuid).Error
}

// Task methods
func (r *PostgresRepo) CreateTask(task *models.Task) error {
	return r.DB.Create(task).Error
}

func (r *PostgresRepo) GetAllTasks() ([]models.Task, error) {
	var tasks []models.Task
	err := r.DB.Preload("User").Find(&tasks).Error
	return tasks, err
}

func (r *PostgresRepo) GetTaskByID(uuid string) (*models.Task, error) {
	var task models.Task
	err := r.DB.Where("uuid = ?", uuid).First(&task).Error
	return &task, err
}

func (r *PostgresRepo) UpdateTask(task *models.Task) error {
	return r.DB.Save(task).Error
}

func (r *PostgresRepo) DeleteTask(uuid string) error {
	return r.DB.Delete(&models.Task{}, "uuid = ?", uuid).Error
}

// UserPosition methods
func (r *PostgresRepo) CreateUserPosition(userPosition *models.UserPosition) error {
	return r.DB.Create(userPosition).Error
}

func (r *PostgresRepo) GetAllUserPositions() ([]models.UserPosition, error) {
	var userPositions []models.UserPosition
	err := r.DB.Preload("Position").Preload("User").Find(&userPositions).Error
	return userPositions, err
}

func (r *PostgresRepo) GetUserPositionByID(uuid string) (*models.UserPosition, error) {
	var userPosition models.UserPosition
	err := r.DB.Preload("Position").Preload("User").Where("uuid = ?", uuid).First(&userPosition).Error
	return &userPosition, err
}

func (r *PostgresRepo) UpdateUserPosition(userPosition *models.UserPosition) error {
	return r.DB.Save(userPosition).Error
}

func (r *PostgresRepo) DeleteUserPosition(uuid string) error {
	return r.DB.Delete(&models.UserPosition{}, "uuid = ?", uuid).Error
}
