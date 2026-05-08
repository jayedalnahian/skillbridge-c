export type UserRole = "ADMIN" | "TUTOR" | "STUDENT";

export const UserRole = {
  ADMIN: "ADMIN" as const,
  TUTOR: "TUTOR" as const,
  STUDENT: "STUDENT" as const,
};

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : []
}

export const tutorProtectedRoutes : RouteConfig = {
    pattern: [/^\/tutor/ ], // Matches any path that starts with /tutor
    exact : [] 
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin/ ], // Matches any path that starts with /admin
    exact : []
}

// export const superAdminProtectedRoutes : RouteConfig = {
//     pattern: [/^\/admin\/dashboard/ ], // Matches any path that starts with /super-admin/dashboard
//     exact : []
// }

export const studentProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/ ], // Matches any path that starts with /dashboard
    exact : [ "/payment/success"]
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "ADMIN" | "TUTOR" | "STUDENT" | "COMMON" | null => {
    if(isRouteMatches(pathname, tutorProtectedRoutes)) {
        return "TUTOR";
    }

    // if (isRouteMatches(pathname, superAdminProtectedRoutes)) {
    //     return "SUPER_ADMIN";
    // }

    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    
    if(isRouteMatches(pathname, studentProtectedRoutes)) {
        return "STUDENT";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if(role === "ADMIN") {
        return "/admin/dashboard";
    }
    if(role === "TUTOR") {
        return "/tutor/dashboard";
    }
    if(role === "STUDENT") {
        return "/dashboard";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
   

    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === role){
        return true;
    }

    return false;
}