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
  try {
    // Ensure the pathname is a valid string
    const pathname = request.nextUrl.pathname;

    // Log the pathname to confirm its value for debugging
    console.log("Request Pathname:", pathname);

    // If pathname is invalid or undefined, skip the middleware logic
    if (!pathname || typeof pathname !== "string") {
      console.warn("Invalid pathname detected. Skipping middleware.");
      return NextResponse.next();
    }

    // Skip middleware for internal and special routes
    if (
      pathname.indexOf("/_next") === 0 ||
      pathname.indexOf("/api") === 0 ||
      pathname === "/_error" ||
      pathname === "/_not-found" ||
      pathname === "/favicon.ico"
    ) {
      return NextResponse.next();
    }

    // Check for session token
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    // Determine if the route is private or auth-related
    const isPrivateRoute = pathname.indexOf("/private") === 0;
    const isAuthRoute = pathname.indexOf("/auth") === 0;

    // Redirect unauthenticated users for private routes
    if (isPrivateRoute && !sessionToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Redirect authenticated users from auth routes
    if (isAuthRoute && sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Continue with the request if no issues
    return NextResponse.next();
  } catch (error) {
    // Log any error that happens in the middleware
    console.error("Middleware error:", error);
    return NextResponse.next(); // Continue with the request, allowing it to fall through
  }
}

export const config = {
  matcher: ["/private/:path*", "/auth/:path*"],
};
