import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** HTTP Basic Auth gate for /admin. Set ADMIN_USER + ADMIN_PASSWORD in Netlify.
 *  If they're unset, the admin area is blocked entirely (never exposes data).
 *  (Next 16 file convention: `proxy.ts`, formerly `middleware.ts`.) */
export function proxy(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Admin is not configured. Set ADMIN_USER and ADMIN_PASSWORD.", {
      status: 503,
    });
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const i = decoded.indexOf(":");
      if (decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
        return NextResponse.next();
      }
    } catch {}
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Smart Voice AI Admin"' },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
