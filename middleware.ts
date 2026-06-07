import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/profile", "/chat"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isLoggedIn = !!sessionCookie;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    "/chat/:path*",
    "/upgrade",
    "/login",
    "/register",
  ],
};
