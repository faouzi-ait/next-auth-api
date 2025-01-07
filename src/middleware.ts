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
  const { pathname } = request.nextUrl;
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isPrivateRoute =
    typeof pathname === "string" && pathname.startsWith("/private");
  const isAuthRoute =
    typeof pathname === "string" && pathname.startsWith("/auth");

  if (isPrivateRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next(); // Allow request to proceed
}

export const config = {
  matcher: [
    "/private/:path*",
    "/auth/:path*",
    "/!/_next/static/:path*", // Exclude static files
    "/!/_next/image/:path*", // Exclude image routes
    "/!/favicon.ico",
    "/!/api/:path*", // Exclude API routes
  ],
};
