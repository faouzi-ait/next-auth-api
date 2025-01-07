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
    if (!request.nextUrl || typeof request.nextUrl.pathname !== "string") {
      console.warn("Skipping middleware due to missing nextUrl or pathname");
      return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;

    if (
      pathname.indexOf("/_next") === 0 ||
      pathname.indexOf("/api") === 0 ||
      pathname === "/_error" ||
      pathname.indexOf("/_not-found") === 0 ||
      pathname === "/favicon.ico"
    ) {
      return NextResponse.next();
    }

    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    const isPrivateRoute = pathname.indexOf("/private") === 0;
    const isAuthRoute = pathname.indexOf("/auth") === 0;

    if (isPrivateRoute && !sessionToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (isAuthRoute && sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next(); // Fallback to allowing the request
  }
}

export const config = {
  matcher: ["/private/:path*", "/auth/:path*"],
};
