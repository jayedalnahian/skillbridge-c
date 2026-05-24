import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

// Only evaluate environment variables at client-side runtime, not at build time
// Use dynamic fallback to prevent undefined errors during build
const baseApiUrl = typeof window !== "undefined" 
  ? process.env.NEXT_PUBLIC_API_BASE_URL || "" 
  : "";


export const authClient = createAuthClient({
  // Point client directly to Express backend's Better Auth path
  baseURL: baseApiUrl,
  fetchOptions: { credentials: "include" },

  plugins: [
    {
      id: "next-cookies-request",
      fetchPlugins: [
        {
          id: "next-cookies-request-plugin",
          name: "next-cookies-request-plugin",
          hooks: {
            async onRequest(ctx) {
              if (typeof window === "undefined") {
                const { cookies } = await import("next/headers");
                const headers = await cookies();
                ctx.headers.set("cookie", headers.toString());
              }
            },
          },
        },
      ],
    },
  ],
});


