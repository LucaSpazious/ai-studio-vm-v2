-- VM AI Studio v2 — Database Schema
-- Run this in Supabase SQL Editor

-- Categories (e.g. "Rooms", "Common Areas", "Restaurants")
create table if not exists aistudio_categories (
  id uuid primary key default gen_random_uuid(),
  property_id text not null,
  parent_id uuid references aistudio_categories(id) on delete set null,
  name text not null,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- Spaces (e.g. "Ocean Suite", "Lobby", "Pool Bar")
create table if not exists aistudio_spaces (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references aistudio_categories(id) on delete cascade,
  property_id text not null,
  name text not null,
  created_at timestamptz not null default now()
);

-- Assets (day/night photo pairs)
create table if not exists aistudio_assets (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references aistudio_spaces(id) on delete cascade,
  property_id text not null,
  name text not null,
  day_url text,
  night_url text,
  day_storage_path text,
  night_storage_path text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'error')),
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_categories_property on aistudio_categories(property_id);
create index if not exists idx_spaces_category on aistudio_spaces(category_id);
create index if not exists idx_spaces_property on aistudio_spaces(property_id);
create index if not exists idx_assets_space on aistudio_assets(space_id);
create index if not exists idx_assets_property on aistudio_assets(property_id);
create index if not exists idx_assets_status on aistudio_assets(status);
