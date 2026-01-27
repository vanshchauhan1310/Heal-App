-- Create a public profiles table to handle detailed health data
-- This is standard Supabase practice to avoid overloading auth.users metadata

create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  full_name text,
  dob date,
  height numeric, -- in cm
  weight numeric, -- in kg
  bmi numeric,
  bmi_status text,
  
  -- Cycle Data
  last_period_date date,
  avg_cycle_length int,
  avg_period_length int,
  
  -- PCOS Assessment
  risk_score int,
  risk_level text, -- 'Low', 'Moderate', 'High'
  symptoms jsonb, -- Array of selected symptoms from quiz
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
