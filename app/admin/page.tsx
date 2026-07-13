import { getRecentLeads, getRecentBookings, getExperienceStats, getProspects, dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

function fmt(d: unknown) {
  if (!d) return "";
  try {
    return new Date(d as string).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return String(d);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table({ cols, rows }: { cols: string[]; rows: any[] }) {
  if (!rows.length) return <p className="admin-empty">No records yet.</p>;
  return (
    <div className="admin-scroll">
      <table className="admin-table">
        <thead>
          <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c] ?? "")}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminPage() {
  if (!dbConfigured()) {
    return (
      <div className="admin-wrap">
        <h1>Smart Voice AI — CRM</h1>
        <p className="admin-empty">Database not connected. Set <code>DATABASE_URL</code> in Netlify.</p>
      </div>
    );
  }

  const [leads, bookings, stats, prospects] = await Promise.all([
    getRecentLeads(200),
    getRecentBookings(200),
    getExperienceStats(),
    getProspects(200),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadRows = (leads as any[]).map((l) => ({
    Name: l.name, Email: l.email, Phone: l.mobile, Company: l.company,
    Industry: l.industry, Source: l.source, Received: fmt(l.created_at),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookingRows = (bookings as any[]).map((b) => ({
    Name: b.name, Email: b.email, Phone: b.phone, "Preferred time": b.preferred_time,
    Notes: b.notes, Source: b.source, Booked: fmt(b.created_at),
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prospectRows = (prospects as any[]).map((p) => ({
    Name: p.name, Email: p.email, Phone: p.phone, City: p.city,
    Country: p.country, "Call status": p.call_status || "—", Added: fmt(p.created_at),
  }));

  return (
    <div className="admin-wrap">
      <h1>Smart Voice AI — CRM</h1>

      <div className="admin-cards">
        <div className="admin-card"><div className="num">{leadRows.length}</div><div className="label">Leads</div></div>
        <div className="admin-card"><div className="num">{bookingRows.length}</div><div className="label">Bookings</div></div>
        <div className="admin-card"><div className="num">{(stats as { used: number }).used}</div><div className="label">Sample calls used</div></div>
        <div className="admin-card"><div className="num">{prospectRows.length}</div><div className="label">Prospects</div></div>
      </div>

      <h2>Leads</h2>
      <Table cols={["Name", "Email", "Phone", "Company", "Industry", "Source", "Received"]} rows={leadRows} />

      <h2>Demo bookings</h2>
      <Table cols={["Name", "Email", "Phone", "Preferred time", "Notes", "Source", "Booked"]} rows={bookingRows} />

      <h2>Prospects <span className="admin-sub">(outbound list)</span></h2>
      <Table cols={["Name", "Email", "Phone", "City", "Country", "Call status", "Added"]} rows={prospectRows} />
    </div>
  );
}
