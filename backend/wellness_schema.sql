-- Cycles Table (for tracking periods)
create table public.cycles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  start_date date not null,
  end_date date,
  type text default 'period', -- 'period', 'spotting', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wellness Logs Table (Daily logs for symptoms, mood, sleep, etc.)
create table public.wellness_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  
  -- Metrics
  flow_intensity text, -- 'light', 'medium', 'heavy'
  symptoms jsonb default '[]'::jsonb, -- Array of strings
  mood text,
  mood_emoji text, -- Optional, to store the icon if needed, or mapping logic in FE
  hydration int default 0,
  sleep numeric default 0,
  exercise int default 0, -- in minutes
  notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date) -- One log per user per day
);

-- RLS Policies
alter table public.cycles enable row level security;
alter table public.wellness_logs enable row level security;

create policy "Users can view own cycles" on cycles for select using (auth.uid() = user_id);
create policy "Users can insert own cycles" on cycles for insert with check (auth.uid() = user_id);
create policy "Users can update own cycles" on cycles for update using (auth.uid() = user_id);

create policy "Users can view own logs" on wellness_logs for select using (auth.uid() = user_id);
create policy "Users can upsert own logs" on wellness_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own logs" on wellness_logs for update using (auth.uid() = user_id);
