package models

import "time"

type Task struct {
	UUID      string    `json:"uuid" gorm:"primaryKey"`
	UserID    string    `json:"user_id"`
	Todo      string    `json:"todo"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	User      User      `gorm:"foreignKey:UserID;references:UUID" json:"user"`
}
