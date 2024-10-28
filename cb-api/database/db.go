package database

import (
	"database/sql"
	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func Connect(url string) (*DB, error) {
	// FIXME: Real impl - this is docker only test
	db, err := sql.Open("postgres", url)
	val := &DB{db}
	return val, err
}

func (d *DB) Close() error {
	err := d.DB.Close()
	return err
}
