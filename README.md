# VM AI Studio v2

SaaS for hotels — transforms daytime property photos to nighttime using AI.

## Setup

### Prerequisites
- Node.js v20 (`nvm use 20`)
- Supabase project
- Replicate API token

### Install

```bash
nvm use 20
npm install
```

### Environment Variables

Copy `.env.local` and fill in the values:

```
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database

Run `supabase/schema.sql` in the Supabase SQL Editor to create the required tables.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Deploy

```bash
vercel --prod
```

Deploy to team **spazious** (luca@spazious.com).

## Tech Stack

- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS
- Supabase (Storage + Postgres)
- Replicate (`black-forest-labs/flux-kontext-pro`)
- Vercel
