import postgres from "postgres";

/**
 * Postgres access layer.
 *
 * Works with any Postgres provider (Neon, Supabase, Railway, RDS…). Set
 * DATABASE_URL in your environment. If it is NOT set, every function below
 * safely no-ops so the site still builds and the contact form still emails.
 *
 * `prepare: false` keeps it compatible with transaction-pooling proxies
 * (e.g. Supabase's pooler / PgBouncer).
 */

let sql: ReturnType<typeof postgres> | null = null;
let initPromise: Promise<void> | null = null;

function getClient() {
  if (sql) return sql;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  sql = postgres(url, { prepare: false, max: 1, idle_timeout: 20 });
  return sql;
}

/** Lazily ensure tables exist (runs once per warm instance). */
async function ensureSchema(client: ReturnType<typeof postgres>) {
  if (!initPromise) {
    initPromise = (async () => {
      await client`
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
      `;
      await client`
        CREATE TABLE IF NOT EXISTS subscribers (
          id          BIGSERIAL PRIMARY KEY,
          email       TEXT NOT NULL UNIQUE,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `;
    })();
  }
  return initPromise;
}

export interface LeadInput {
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  website?: string;
  industry?: string;
  message?: string;
  source?: string;
  userAgent?: string;
}

/** Returns true if the lead was persisted, false if DB is not configured. */
export async function saveLead(lead: LeadInput): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  await ensureSchema(client);
  await client`
    INSERT INTO leads (name, email, mobile, company, website, industry, message, source, user_agent)
    VALUES (${lead.name}, ${lead.email}, ${lead.mobile ?? null}, ${lead.company ?? null},
            ${lead.website ?? null}, ${lead.industry ?? null}, ${lead.message ?? null},
            ${lead.source ?? null}, ${lead.userAgent ?? null})
  `;
  return true;
}

/** Returns true if stored, false if DB not configured. Idempotent on email. */
export async function saveSubscriber(email: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  await ensureSchema(client);
  await client`
    INSERT INTO subscribers (email) VALUES (${email})
    ON CONFLICT (email) DO NOTHING
  `;
  return true;
}
