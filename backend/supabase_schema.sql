-- Create the 'posts' table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- In a real app, this would reference auth.users(id)
  content text not null,
  category text not null,
  is_anonymous boolean default false,
  likes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - Optional for now but good practice
alter table public.posts enable row level security;

-- Create a policy that allows anyone to read posts (since we have a community feed)
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using ( true );

-- Create a policy that allows authenticated users to insert their own posts
-- For now, allowing all inserts for development ease if you haven't set up full Auth policies yet
create policy "Anyone can insert posts"
  on public.posts for insert
  with check ( true );
