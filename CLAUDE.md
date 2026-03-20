# VM AI Studio v2

## Project Overview
SaaS for hotels — transforms daytime property photos to nighttime using AI.
Property demo: Rosewood Mayakoba.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Storage:** Supabase Storage (service role key for server-side writes)
- **Image Generation:** Replicate API (`black-forest-labs/flux-kontext-pro`)
- **Deployment:** Vercel (team: spazious, luca@spazious.com)

## Commands
- `nvm use 20` — REQUIRED before any npm command
- `npm run dev` — Start dev server
- `npm run build` — Production build (must pass before any git push)
- `npm run lint` — ESLint

## Architecture
- `lib/supabase.ts` — Supabase client factories (browser + service role)
- `app/api/generate/route.ts` — Calls Replicate for image generation
- `supabase/schema.sql` — Database schema

## Lessons Learned

### Node Version
- Node v20 obligatory — always `nvm use 20` before any command.

### Image Generation
- **Replicate flux-kontext-pro works.** fal.ai was tested and discarded (inconsistent model naming, 404s, requires explicit config).
- Replicate `replicate.run()` returns a `FileOutput` object, not a string. Extract URL with `output.url().href`.
- Replicate model input uses `input_image`, not `image_url`.
- **strength: 0.55** for Night Mode (0.75 too dark, 0.45 too subtle).

### Supabase
- **getServiceSupabase() ALWAYS for writes.** Client-side uploads with anon key fail without RLS INSERT policies.
- Bucket names must match exactly.

### Vercel Deployment
- Always deploy to team **spazious** (luca@spazious.com).
- `vercel.json` with `maxDuration: 120` for `/api/generate`.
- `NEXTAUTH_URL` must always be the canonical URL, never `VERCEL_URL`.

## Environment Variables (Required)
- `REPLICATE_API_TOKEN` — Replicate API token
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
