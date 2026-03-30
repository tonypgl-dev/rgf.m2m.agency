import { NextResponse, type NextRequest } from "next/server";

// MOCK MODE: auth is handled server-side in createClient (server.ts).
// This middleware is a passthrough — no auth redirects while mock is active.
export async function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, manifest, icons (static assets)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest|icons|api).*)",
  ],
};
