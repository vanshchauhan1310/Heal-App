-- Add author info columns to posts table
alter table public.posts
add column author_name text,
add column author_handle text;

-- (Optional) If you want to re-create the table from scratch:
/*
drop table if exists public.posts;
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  content text not null,
  category text not null,
  is_anonymous boolean default false,
  likes int default 0,
  author_name text,
  author_handle text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.posts enable row level security;
create policy "Public posts are viewable by everyone" on public.posts for select using ( true );
create policy "Anyone can insert posts" on public.posts for insert with check ( true );
*/
