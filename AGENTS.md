<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SkillBridge-C (Frontend) — Agent Context

## What this repo is
- Next.js app-router frontend for SkillBridge.
- TypeScript + React 19 + Next `16.2.3`.
- UI: Tailwind v4 + shadcn-style components in `src/components/ui`.
- Data: TanStack Query + Axios wrapper (`src/lib/axios/httpClient.ts`).

## Run / build / lint
- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
- Lint: `bun run lint`

## Required environment
- `NEXT_PUBLIC_API_BASE_URL` is required at import-time.
  - Used by `src/lib/axios/httpClient.ts` and `src/services/auth.services.ts`.
  - Keep it set in `.env` / `.env.example` when adding new modules.

## Project layout
- Routes: `src/app/**` (route groups like `(commonRoutes)` and `(dashboardRoutes)` are used heavily)
- Components: `src/components/**`
  - Reusable UI primitives: `src/components/ui/**`
  - Feature modules: `src/components/modules/**`
- Services (API calls / server actions): `src/services/**`
- HTTP client: `src/lib/axios/httpClient.ts`
- Types: `src/types/**`
- Validation: `src/zod/**` (Zod v4)

## API / auth integration conventions
- Prefer using `src/lib/axios/httpClient.ts` for API requests.
  - Browser: uses `withCredentials: true` (cookies handled by browser)
  - Server (RSC / Server Actions): builds a `Cookie` header from `next/headers` and can refresh tokens.
- Server Actions live in `src/services/**` and should start with `"use server"` when appropriate.
- Avoid importing `next/headers` from client components; only use it in server-only modules (RSC/server actions).

## Response contract assumptions
- API responses are expected to match `src/types/api.types.ts`.
  - `ApiResponse<T>`: `{ success: true, message, data, meta? }`
  - For failures, expect `{ success: false, message }`

## Coding rules of thumb
- Default to Server Components in `src/app/**`; add `"use client"` only when you need state/effects/browser APIs.
- Keep API/base URLs out of components; place API calls in `src/services/**`.
- Reuse existing UI primitives in `src/components/ui/**` before introducing new dependencies.
- Preserve existing file/folder naming patterns and route-group structure.

## When making changes
- Before implementing, locate the closest existing pattern (similar page/module) and follow it.
- For new API interactions, add a service function + types first, then wire into components.
- If you add a new env var, update `.env.example`.
