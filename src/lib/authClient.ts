import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

// Get the backend origin (e.g. http://localhost:5050) from NEXT_PUBLIC_API_BASE_URL (http://localhost:5050/api/v1)
const getBackendUrl = () => {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (baseApiUrl) {
    return baseApiUrl.replace("/api/v1", "");
  }
  return "http://localhost:5050";
};

export const authClient = createAuthClient({
  // Point client directly to Express backend's Better Auth path
  baseURL: getBackendUrl(),
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

export const signInWithGoogle = async (redirectPath: string = "/dashboard") => {
  const backendUrl = getBackendUrl();
  // Redirect to backend's success endpoint so JWT tokens (accessToken/refreshToken) are set properly
  const callbackURL = `${backendUrl}/api/v1/auth/google/success?redirect=${encodeURIComponent(redirectPath)}`;

  return await authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
};

