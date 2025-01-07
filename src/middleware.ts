/* 
  - Middleware to protect private pages from being accessed by unauthenticated users.
*/

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export const config = {
//   matcher: ["/private/:path*"],
// };

// export function middleware(request: NextRequest) {
//   const sessionToken = request.cookies.get("next-auth.session-token")?.value;

//   if (!sessionToken) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }
//   return NextResponse.next();
// }

/* 
  - Middleware to stop login and register pages from being accessed by authenticated users
    and to redirect unauthenticated users trying to access private pages.
*/

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl || typeof request.nextUrl.pathname !== "string") {
    console.warn("Skipping middleware due to missing nextUrl or pathname");
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") || // Static files and internal assets
    pathname === "/_error" || // Error page
    pathname === "/_not-found" || // Not-found page
    pathname === "/favicon.ico" || // Favicon
    pathname.startsWith("/api") // API routes
  ) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isPrivateRoute = pathname.startsWith("/private");
  const isAuthRoute = pathname.startsWith("/auth");

  if (isPrivateRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/private/:path*", "/auth/:path*"],
};
