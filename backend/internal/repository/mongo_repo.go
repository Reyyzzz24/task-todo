package repository

type MongoRepo struct { /* Collection Mongo */
}

func (r *MongoRepo) LogAction(action string, entity string, id string) {
	// Gunakan Driver MongoDB untuk menyimpan dokumen log ke koleksi 'audit_logs'
	// Log ini akan berisi: action, entity, id, dan timestamp
}
