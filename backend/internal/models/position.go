package models

// Position represents a job position
type Position struct {
	UUID          string         `gorm:"primaryKey" json:"uuid"`
	Name          string         `json:"name"`
	UserPositions []UserPosition `gorm:"foreignKey:PositionID;references:UUID" json:"user_positions,omitempty"`
}
