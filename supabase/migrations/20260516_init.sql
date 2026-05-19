create extension if not exists "uuid-ossp";

create table if not exists stars (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_cn text not null,
  name_en text not null,
  fandom_name text,
  agency text,
  birthday date,
  base_city text,
  bio text,
  tags text[] default '{}',
  avatar_url text,
  cover_url text,
  popularity_score integer default 0,
  china_fan_priority integer default 999,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  type text not null,
  status text not null default 'scheduled',
  city text,
  venue text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  source_url text,
  booking_url text,
  summary text,
  details_md text,
  language text default 'zh-CN',
  confidence_score numeric(4,2) default 0.00,
  ai_extracted jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists event_stars (
  event_id uuid references events(id) on delete cascade,
  star_id uuid references stars(id) on delete cascade,
  role text default 'guest',
  primary key (event_id, star_id)
);

create table if not exists news_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body_md text,
  category text,
  published_at timestamptz,
  source_url text,
  cover_url text,
  related_star_slugs text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists service_requests (
  id uuid primary key default uuid_generate_v4(),
  fan_name text not null,
  contact_handle text not null,
  service_type text not null,
  target_star text,
  desired_date date,
  budget_range text,
  notes text,
  status text not null default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ingestion_jobs (
  id uuid primary key default uuid_generate_v4(),
  source_url text not null,
  source_type text not null,
  model_vendor text not null,
  status text not null default 'queued',
  raw_content text,
  translated_content text,
  summary text,
  extracted_payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
