CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    request_id UUID,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_created_at
ON audit_logs(created_at);

CREATE INDEX idx_audit_logs_user_id
ON audit_logs(user_id);