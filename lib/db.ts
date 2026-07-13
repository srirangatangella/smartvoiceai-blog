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
      // Demo bookings captured by the AI booker (or the site).
      await client`
        CREATE TABLE IF NOT EXISTS bookings (
          id             BIGSERIAL PRIMARY KEY,
          name           TEXT,
          email          TEXT,
          phone          TEXT,
          preferred_time TEXT,
          notes          TEXT,
          source         TEXT,
          created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
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

/* ─────────────── Bookings ─────────────── */

export interface BookingInput {
  name?: string;
  email?: string;
  phone?: string;
  preferredTime?: string;
  notes?: string;
  source?: string;
}

export async function saveBooking(b: BookingInput): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  await ensureSchema(client);
  await client`
    INSERT INTO bookings (name, email, phone, preferred_time, notes, source)
    VALUES (${b.name ?? null}, ${b.email ?? null}, ${b.phone ?? null},
            ${b.preferredTime ?? null}, ${b.notes ?? null}, ${b.source ?? "ai_booker"})
  `;
  return true;
}

/* ─────────────── Dashboard reads (used by /admin) ─────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeQuery<T = any>(fn: (client: ReturnType<typeof postgres>) => Promise<T>, fallback: T): Promise<T> {
  const client = getClient();
  if (!client) return fallback;
  try {
    await ensureSchema(client);
    return await fn(client);
  } catch (e) {
    console.error("dashboard query failed:", e);
    return fallback;
  }
}

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getRecentLeads(limit = 100) {
  return safeQuery(
    (c) => c`SELECT name, email, mobile, company, website, industry, message, source, created_at
             FROM leads ORDER BY created_at DESC LIMIT ${limit}`,
    []
  );
}

export async function getRecentBookings(limit = 100) {
  return safeQuery(
    (c) => c`SELECT name, email, phone, preferred_time, notes, source, created_at
             FROM bookings ORDER BY created_at DESC LIMIT ${limit}`,
    []
  );
}

export async function getExperienceStats() {
  return safeQuery(
    async (c) => {
      const [row] = await c`SELECT count(*)::int AS total,
        count(*) FILTER (WHERE used)::int AS used,
        coalesce(round(avg(duration_seconds) FILTER (WHERE duration_seconds IS NOT NULL)),0)::int AS avg_seconds
        FROM experiences`;
      return row;
    },
    { total: 0, used: 0, avg_seconds: 0 }
  );
}

/** Prospects table is created by the scraper; may not exist if a separate DB is used. */
export async function getProspects(limit = 100) {
  return safeQuery(
    (c) => c`SELECT name, email, phone, city, country, call_status, created_at
             FROM prospects ORDER BY created_at DESC LIMIT ${limit}`,
    []
  );
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
