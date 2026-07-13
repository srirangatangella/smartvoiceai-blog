import postgres from "postgres";
import { randomBytes } from "crypto";

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
      // One-time, capped sample-assistant sessions (the free 1–2 min demo).
      await client`
        CREATE TABLE IF NOT EXISTS experiences (
          token            TEXT PRIMARY KEY,
          business_name    TEXT,
          industry         TEXT,
          website          TEXT,
          profile          TEXT,
          used             BOOLEAN NOT NULL DEFAULT false,
          started_at       TIMESTAMPTZ,
          ended_at         TIMESTAMPTZ,
          duration_seconds INT,
          created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
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

/* ─────────────── Sample-experience sessions (one-time, capped) ─────────────── */

export interface ExperienceInput {
  businessName?: string;
  industry?: string;
  website?: string;
  profile?: string;
}

export interface ExperienceRow {
  token: string;
  business_name: string | null;
  industry: string | null;
  website: string | null;
  profile: string | null;
  used: boolean;
}

/** Create a session token for a lead/prospect. Returns null if DB not configured. */
export async function createExperience(data: ExperienceInput): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  await ensureSchema(client);
  const token = randomBytes(16).toString("hex");
  await client`
    INSERT INTO experiences (token, business_name, industry, website, profile)
    VALUES (${token}, ${data.businessName ?? null}, ${data.industry ?? null},
            ${data.website ?? null}, ${data.profile ?? null})
  `;
  return token;
}

export async function getExperience(token: string): Promise<ExperienceRow | null> {
  const client = getClient();
  if (!client) return null;
  await ensureSchema(client);
  const rows = await client`
    SELECT token, business_name, industry, website, profile, used
    FROM experiences WHERE token = ${token}
  `;
  return (rows[0] as ExperienceRow) ?? null;
}

/** Atomically claim the single allowed session. Returns true only on the FIRST call. */
export async function consumeExperience(token: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  await ensureSchema(client);
  const rows = await client`
    UPDATE experiences SET used = true, started_at = now()
    WHERE token = ${token} AND used = false
    RETURNING token
  `;
  return rows.length > 0;
}

export async function endExperience(token: string, seconds: number): Promise<void> {
  const client = getClient();
  if (!client) return;
  await ensureSchema(client);
  await client`
    UPDATE experiences SET ended_at = now(), duration_seconds = ${Math.round(seconds)}
    WHERE token = ${token}
  `;
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
