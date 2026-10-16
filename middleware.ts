import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/profile", "/chat"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!getSessionCookie(request);

  if (!isLoggedIn && matches(pathname, protectedRoutes)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && matches(pathname, authRoutes)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/chat/:path*", "/login", "/register"],
};