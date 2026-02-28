-- CocoonPulse Database Schema

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  telegram_id   BIGINT UNIQUE NOT NULL,
  wallet_address VARCHAR(128),
  username       VARCHAR(128),
  first_name     VARCHAR(128),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nodes (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  node_id         VARCHAR(64) UNIQUE NOT NULL,
  name            VARCHAR(128) NOT NULL DEFAULT 'Unnamed Node',
  wallet_address  VARCHAR(128) NOT NULL,
  gpu_model       VARCHAR(128),
  vram_total_mb   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS node_metrics (
  id              SERIAL PRIMARY KEY,
  node_id         VARCHAR(64) NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
  status          VARCHAR(16) NOT NULL DEFAULT 'offline',
  gpu_utilization SMALLINT NOT NULL DEFAULT 0,
  vram_used_mb    INTEGER NOT NULL DEFAULT 0,
  temperature     SMALLINT NOT NULL DEFAULT 0,
  uptime_seconds  BIGINT NOT NULL DEFAULT 0,
  tee_status      VARCHAR(16) NOT NULL DEFAULT 'pending',
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_node_metrics_node_id ON node_metrics(node_id);
CREATE INDEX idx_node_metrics_recorded_at ON node_metrics(recorded_at);

CREATE TABLE IF NOT EXISTS earnings (
  id              SERIAL PRIMARY KEY,
  task_id         VARCHAR(64) UNIQUE NOT NULL,
  node_id         VARCHAR(64) NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
  task_type       VARCHAR(32) NOT NULL DEFAULT 'other',
  ton_reward      NUMERIC(18, 9) NOT NULL DEFAULT 0,
  compute_time_ms INTEGER NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_earnings_node_id ON earnings(node_id);
CREATE INDEX idx_earnings_completed_at ON earnings(completed_at);
CREATE INDEX idx_earnings_task_type ON earnings(task_type);

CREATE TABLE IF NOT EXISTS alert_preferences (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  node_offline        BOOLEAN NOT NULL DEFAULT TRUE,
  temp_threshold      BOOLEAN NOT NULL DEFAULT TRUE,
  temp_threshold_value SMALLINT NOT NULL DEFAULT 85,
  earnings_drop       BOOLEAN NOT NULL DEFAULT TRUE,
  tee_failure         BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_earnings_cache (
  id          SERIAL PRIMARY KEY,
  node_id     VARCHAR(64) NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  total_ton   NUMERIC(18, 9) NOT NULL DEFAULT 0,
  task_count  INTEGER NOT NULL DEFAULT 0,
  UNIQUE(node_id, date)
);

CREATE INDEX idx_daily_earnings_cache_date ON daily_earnings_cache(date);
