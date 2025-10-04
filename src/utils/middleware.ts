// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.mysecretekey!; // Make sure to define this in your .env file

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // List of protected routes
  const protectedRoutes = ["/api/*", "/api/secure-data", "/dashboard"];

  // Check if the requested route is a protected one
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Retrieve the JWT token from cookies
    const user = JSON.parse(request.cookies.get("auth")?.value as any);
    const token = user?.token;
    // Redirect to login if the token is missing
    if (!token) {

      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify the JWT token
    try {
      jwt.verify(token, SECRET_KEY); // Verify using the SECRET_KEY

      if (pathname === "/login") {
        const dashboardUrl = new URL("/dashboard", origin);
        return NextResponse.redirect(dashboardUrl);
      }
      return NextResponse.next(); // Allow access if the token is valid
    } catch (err) {
      // Redirect to login if the token is invalid
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow access to non-protected routes
  return NextResponse.next();
}

// Configuration to apply middleware only to API routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};

