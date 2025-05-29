import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of unprotected paths
const unprotectedPaths = ["/login", "/register", "/api", "/favicon.ico", "/_next"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow unprotected paths
  if (unprotectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for a session cookie (adjust name if needed)
  const hasSession = request.cookies.get("session")?.value;

  // If not logged in, redirect to login
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: "/:path*",
};