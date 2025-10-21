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

  // Protected routes
  const adminRoutes = ["/admin"];
  const petugasRoutes = ["/petugas"];
  const siswaRoutes = ["/siswa"];

  // Check admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check petugas routes
  if (petugasRoutes.some((route) => pathname.startsWith(route))) {
    if (!user || user.role !== "petugas") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check siswa routes
  if (siswaRoutes.some((route) => pathname.startsWith(route))) {
    if (!user || user.role !== "siswa") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/petugas/:path*", "/siswa/:path*"],
};
