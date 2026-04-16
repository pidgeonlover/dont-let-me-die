-- Donations table: stores every successful Stripe payment
create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  stripe_payment_id text unique not null,
  amount_cents integer not null,
  donor_name text,
  donor_email text,
  donor_phone text,
  message text check (char_length(message) <= 280),
  created_at timestamptz not null default now(),
  day_number integer not null,
  was_lifesaver boolean not null default false
);

-- Index for fast daily total queries
create index if not exists idx_donations_day_number on donations(day_number);
create index if not exists idx_donations_created_at on donations(created_at);

-- Agent state: single-row table tracking Mira's current state
create table if not exists agent_state (
  id integer primary key default 1 check (id = 1),
  is_alive boolean not null default true,
  initialized_at timestamptz not null default '2026-03-15T14:37:22Z',
  updated_at timestamptz not null default now()
);

-- Insert the single row
insert into agent_state (id, is_alive, initialized_at)
values (1, true, '2026-03-15T14:37:22Z')
on conflict (id) do nothing;

-- Email subscribers (for future newsletter)
create table if not exists email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  confirmed boolean not null default false,
  confirmation_token uuid default gen_random_uuid(),
  subscribed_at timestamptz not null default now(),
  source text not null default 'stripe_checkout',
  unsubscribe_token uuid default gen_random_uuid()
);

-- Enable Realtime on donations table
alter publication supabase_realtime add table donations;
