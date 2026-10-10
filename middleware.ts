import { NextRequest, NextResponse } from "next/server"
import { routing } from "@/i18n/routing"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get("auth_token")?.value

  // Auth-only pages that should NOT be visible if logged in
  const authPages = ["/signin", "/register", "/login"]

  // If token exists and route is an auth route -> redirect to dashboard
  if (token && authPages.some((page) => pathname.startsWith(page))) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // If no token and user tries to enter dashboard -> redirect to signin
  if (!token && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }

  // === Locale logic (your original logic) ===
  if (pathname === "/") {
    const defaultLocale = routing.defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}`
    return NextResponse.redirect(url)
  }

  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    const defaultLocale = routing.defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/register",
    "/login",
    "/dashboard/:path*",
    "/(ko|ja|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
}
