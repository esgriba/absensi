import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user data from cookie or header
  const userCookie = request.cookies.get("user")?.value;
  
  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch {
      // Invalid cookie
    }
  }

  // Public routes (no authentication required)
  const publicRoutes = ["/login"];
  
  // If accessing public route, allow
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  const protectedRoutes = [
    "/admin",
    "/petugas", 
    "/siswa",
    "/register",
    "/scan",
    "/attendance",
    "/students",
    "/import"
  ];

  // Check if route needs protection
  const needsAuth = protectedRoutes.some((route) => pathname.startsWith(route));
  
  if (needsAuth && !user) {
    // Not logged in, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  const adminRoutes = ["/admin"];
  const petugasRoutes = ["/petugas"];
  const siswaRoutes = ["/siswa"];

  // Check admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check petugas routes
  if (petugasRoutes.some((route) => pathname.startsWith(route))) {
    if (user.role !== "petugas") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check siswa routes
  if (siswaRoutes.some((route) => pathname.startsWith(route))) {
    if (user.role !== "siswa") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/petugas/:path*", 
    "/siswa/:path*",
    "/register/:path*",
    "/scan/:path*",
    "/attendance/:path*",
    "/students/:path*",
    "/import/:path*"
  ],
};
