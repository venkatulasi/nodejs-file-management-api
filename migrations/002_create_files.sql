CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL UNIQUE,
    path TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    user_id INTEGER NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_files_user_id
ON files(user_id);