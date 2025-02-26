CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    details JSONB, -- store all Jira-like data here in JSON
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

/* Postgres allow to do query via GIN index. We will not use it for now but good feature for the rest */
CREATE INDEX IF NOT EXISTS idx_notifications_details_jsonb
    ON notifications
    USING GIN (details jsonb_path_ops);