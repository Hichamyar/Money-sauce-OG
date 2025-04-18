import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/income", "/expenses", "/projections", "/details"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Redirect to login if accessing a protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("message", "Please login to access this page")
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing login/signup while authenticated
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/income/:path*",
    "/expenses/:path*",
    "/projections/:path*",
    "/details/:path*",
    "/login",
    "/signup",
  ],
}
