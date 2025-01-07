/* 
  - Middleware to protect private pages from being accessed by unauthenticated users.
*/

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/private/:path*"],
};

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

/* 
  - Middleware to stop login and register pages from being accessed by authenticated users
    and to redirect unauthenticated users trying to access private pages.
*/
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   try {
//     const pathname = request.nextUrl.pathname;

//     // Log the pathname for debugging purposes
//     console.log("Request Pathname:", pathname);

//     // If pathname is invalid, skip the middleware
//     if (!pathname || typeof pathname !== "string") {
//       console.warn("Invalid pathname detected. Skipping middleware.");
//       return NextResponse.next();
//     }

//     // Skip middleware for internal routes and special paths
//     const excludedPathsRegex = /\/(_next|api|_error|_not-found|favicon\.ico)/;
//     if (excludedPathsRegex.test(pathname)) {
//       return NextResponse.next();
//     }

//     // Check for session token in cookies
//     const sessionToken =
//       request.cookies.get("next-auth.session-token")?.value ||
//       request.cookies.get("__Secure-next-auth.session-token")?.value;

//     // Regular expressions to match private and auth routes
//     const privateRouteRegex = /^\/private\//;
//     const authRouteRegex = /^\/auth\//;

//     // Redirect unauthenticated users to the login page for private routes
//     if (privateRouteRegex.test(pathname) && !sessionToken) {
//       return NextResponse.redirect(new URL("/auth/login", request.url));
//     }

//     // Redirect authenticated users from auth routes
//     if (authRouteRegex.test(pathname) && sessionToken) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     // Continue with the request if no issues
//     return NextResponse.next();
//   } catch (error) {
//     // Log any error and proceed with the request
//     console.error("Middleware error:", error);
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/private/:path*", "/auth/:path*", "/:path*"], // Ensure to capture all relevant paths
// };
