import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the JWT token from the cookie
  const authToken = request.cookies.get("auth_token")?.value;

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add the JWT token to the request headers if it exists
  if (authToken) {
    requestHeaders.set("x-auth-token", authToken);
  }

  // Add the pathname to the request headers for use in layout components
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
