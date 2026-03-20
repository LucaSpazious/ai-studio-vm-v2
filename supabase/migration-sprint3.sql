-- Sprint 3 migration: change assets to use category_id instead of space_id
-- Run this in Supabase SQL Editor

-- Drop old assets table (no data yet) and recreate with category_id
drop table if exists aistudio_assets;

create table aistudio_assets (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references aistudio_categories(id) on delete cascade,
  property_id text not null,
  name text not null,
  day_url text,
  night_url text,
  day_storage_path text,
  night_storage_path text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'error')),
  created_at timestamptz not null default now()
);

create index idx_assets_category on aistudio_assets(category_id);
create index idx_assets_property on aistudio_assets(property_id);
create index idx_assets_status on aistudio_assets(status);
