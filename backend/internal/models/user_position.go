package models

type UserPosition struct {
	UUID       string   `gorm:"primaryKey" json:"uuid"`
	UserID     string   `json:"user_id"`
	PositionID string   `json:"position_id"`
	User       User     `gorm:"foreignKey:UserID;references:UUID" json:"user"`
	Position   Position `gorm:"foreignKey:PositionID;references:UUID" json:"position"`
}
