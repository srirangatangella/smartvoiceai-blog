-- Smart Voice AI — database schema
-- These tables are created automatically on first write (see lib/db.ts),
-- but you can run this manually to provision them ahead of time.

CREATE TABLE IF NOT EXISTS leads (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  mobile       TEXT,
  company      TEXT,
  website      TEXT,
  industry     TEXT,
  message      TEXT,
  source       TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_industry_idx ON leads (industry);

CREATE TABLE IF NOT EXISTS subscribers (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
