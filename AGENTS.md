# SkillBridge-C (Frontend) — Agent Context

## Stack
- Next.js `16.2.3` app-router + React 19 + TypeScript
- Tailwind v4 + shadcn-style components (`src/components/ui`)
- TanStack Query + Axios wrapper (`src/lib/axios/httpClient.ts`)
- Better Auth client + Zod v4
- Package managers: **bun** for dev (`bun.lock`), also `pnpm-lock.yaml` and `package-lock.json` present

## Commands
- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
- Lint: `bun run lint`
- **No test command configured**

## Required env
- `NEXT_PUBLIC_API_BASE_URL` — used by `src/lib/axios/httpClient.ts` and `src/lib/authClient.ts`. Must point to the backend API (e.g. `http://localhost:5050`). Set in `.env` / `.env.example` when adding new modules.

## Project layout
- Routes: `src/app/**` — route groups `(commonRoutes)` and `(dashboardRoutes)` heavily used
- Components: `src/components/{ui,modules,...}`
- Services (API calls / server actions): `src/services/**`
- HTTP client + helpers: `src/lib/**`
- Auth middleware/proxy: `src/proxy.ts` — runs on every page request, handles redirects, token refresh, role checks
- Types: `src/types/**` — `api.types.ts` defines `ApiResponse<T>` contract
- Validation: `src/zod/**` (Zod v4)
- Hooks: `src/hooks/**` — TanStack Query mutations, data table helpers
- Providers: `src/providers/QueryProvider.tsx`

## API / auth conventions
- Use `src/lib/axios/httpClient.ts` (`httpClient.get/post/put/patch/delete`) for all API calls.
  - Browser: `withCredentials: true`, cookies handled automatically
  - Server (RSC/Server Actions): forwards cookies via `next/headers`; refreshes tokens transparently
- Better Auth client: `src/lib/authClient.ts` — handles server-side cookie forwarding with `next-cookies-request` plugin
- Server Actions in `src/services/**` use `"use server"` directive. Do not import `next/headers` from client components.
- API response shape: `{ success: true, message, data, meta? }` or `{ success: false, message }`

## Coding rules
- Default to Server Components; add `"use client"` only for state/effects/browser APIs
- Place API calls in `src/services/**`, not in components
- Before introducing new dependencies, check existing primitives in `src/components/ui` and `src/lib`
- Follow existing route-group and file-naming patterns
- New env vars must be added to `.env.example`
