import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from "./services/auth.services";

async function refreshTokenMiddleware(refreshToken: string, sessionToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken, sessionToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    console.log("refreshToken", refreshToken);
    console.log("accessToken", accessToken);
    console.log("sessionToken", sessionToken);
    

    // Verify token safely - handle edge runtime crypto limitations
    let decodedAccessToken: { role: string } | null = null;
    let isValidAccessToken = false;
    
    if (accessToken) {
      try {
        const verification = jwtUtils.verifyToken(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string,
        );
        isValidAccessToken = verification.success;
        decodedAccessToken = verification.data as { role: string } | null;
        if (!verification.success) {
          console.log("Token verification failed! Reason:", verification.message);
          console.log("Secret length:", process.env.ACCESS_TOKEN_SECRET?.length);
        }
      } catch (err) {
        // Token verification failed - treat as invalid
        console.log("Token verification threw an error!", err);
        isValidAccessToken = false;
      }
    }

    let userRole: UserRole | null = null;

    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);

    const isAuth = isAuthRoute(pathname);

    //proactively refresh token if refresh token exists and access token is expired or about to expire
    if (
      refreshToken &&
      accessToken &&
      sessionToken &&
      (!isValidAccessToken || (await isTokenExpiringSoon(accessToken)))
    ) {
      const requestHeaders = new Headers(request.headers);

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken, sessionToken);

        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
          // Update the request header but don't return - let the auth route checks run
        }
      } catch (error) {
        console.error("Error refreshing token in middleware:", error);
      }
    }

    // Rule - 1 : Logged-in users should not access auth pages,
    // except pages that may be mandatory due to account state.
    console.log("Rule-1 Debug:", { 
      isAuth, 
      isValidAccessToken, 
      pathname, 
      userRole,
      hasAccessToken: !!accessToken 
    });
  
    if (
      isAuth &&
      isValidAccessToken &&
      pathname !== "/verify-email" &&
      pathname !== "/reset-password"
    ) {
      console.log("Rule-1: Redirecting to", getDefaultDashboardRoute(userRole as UserRole));
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    // Rule - 2 : User is trying to access reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      // case - 1 user has needPasswordChange true
      //no need for case 1 if need password change is handled from change-password page
      if (accessToken && email) {
        const userInfo = await getUserInfo();

        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }

      // Case-2 user coming from forgot password

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-3 User trying to access Public route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
    // NOTE: This check only applies to protected routes (routerOwner !== null)
    if (routerOwner !== null && (!accessToken || !isValidAccessToken)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // Rule - 5: Account state enforcement (email verification, password change)
    // Only check for users with valid tokens accessing protected routes
    if (accessToken && isValidAccessToken && routerOwner !== null) {
      const userInfo = await getUserInfo();

      if (userInfo) {
        // need email verification scenario
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }

          return NextResponse.next();
        }

        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }

        // need password change scenario
        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }

          return NextResponse.next();
        }

        if (!userInfo.needPasswordChange && pathname === "/reset-password") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }
    }

    // Rule - 6 User trying to access Common protected route -> allow if authenticated
    if (routerOwner === "COMMON" && isValidAccessToken) {
      return NextResponse.next();
    }

    // Rule - 7 User trying to visit role based protected route
    // Allow if user has the required role, otherwise redirect to their dashboard
    if (
      (routerOwner === "ADMIN" ||
        routerOwner === "TUTOR" ||
        routerOwner === "STUDENT") &&
      isValidAccessToken
    ) {
      if (routerOwner === userRole) {
        return NextResponse.next();
      }
      // Wrong role - redirect to their own dashboard
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    // Default: Allow the request
    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    // On error, allow the request to proceed rather than blocking the user
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
