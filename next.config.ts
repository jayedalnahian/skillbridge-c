import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  // Disable rewrites if environment variables are not available
  // This prevents path.join() errors during build time when env vars are undefined
  rewrites: () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Only add rewrites if we have the required environment variables
    if (!apiBaseUrl) {
      return [];
    }
    
    const baseUrl = apiBaseUrl.replace(/\/api\/v1$/, "");
    
    return [
      {
        source: "/api/auth/:path*",
        destination: `${baseUrl}/api/auth/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
