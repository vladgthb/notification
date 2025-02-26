CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    task_id INT,
    task_name VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    read_at TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
    ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read
    ON notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at
    ON notifications (created_at);