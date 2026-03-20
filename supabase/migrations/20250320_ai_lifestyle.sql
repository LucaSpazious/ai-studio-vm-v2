-- AI Lifestyle — Job tracking table
-- Run this in Supabase SQL Editor

create table if not exists ai_lifestyle_jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Context
  hotel_id text not null,
  user_id text,

  -- Input
  original_image_url text not null,
  original_image_path text,
  archetype text not null check (archetype in ('family', 'couple', 'business', 'friends', 'solo', 'group')),
  tone text not null check (tone in ('casual', 'luxury', 'active', 'romantic', 'professional')),
  scene_type text not null check (scene_type in ('lobby', 'room', 'pool', 'restaurant', 'other')),
  prompt_used text not null,

  -- Processing
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'error')),
  replicate_prediction_id text,
  error_message text,

  -- Output
  result_image_urls text[] default '{}',
  selected_variation_index int,
  final_image_url text,

  -- Quality scores (0-100, populated after generation)
  quality_background_score int,
  quality_lighting_score int,
  quality_natural_score int,

  -- Metrics
  generation_time_ms int,
  model_version text
);

-- Indexes
create index if not exists idx_lifestyle_hotel on ai_lifestyle_jobs(hotel_id);
create index if not exists idx_lifestyle_status on ai_lifestyle_jobs(status);
create index if not exists idx_lifestyle_created on ai_lifestyle_jobs(created_at desc);

-- Enable RLS
alter table ai_lifestyle_jobs enable row level security;

-- Policies: service role can do everything (via getServiceSupabase)
-- Anon/authenticated can read their own hotel's jobs
create policy "Service role full access" on ai_lifestyle_jobs
  for all using (true) with check (true);

-- Storage bucket for lifestyle images
insert into storage.buckets (id, name, public)
values ('lifestyle-images', 'lifestyle-images', true)
on conflict (id) do nothing;
