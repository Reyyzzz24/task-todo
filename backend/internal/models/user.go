package models

type User struct {
	UUID          string         `gorm:"primaryKey" json:"uuid"`
	Name          string         `json:"name"`
	Username      string         `gorm:"unique" json:"username"`
	Password      string         `json:"-"`
	Tasks         []Task         `gorm:"foreignKey:UserID;references:UUID" json:"tasks,omitempty"`
	UserPositions []UserPosition `gorm:"foreignKey:UserID;references:UUID" json:"user_positions,omitempty"`
}
