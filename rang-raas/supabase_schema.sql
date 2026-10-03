-- Supabase Schema for Rang Raas Ticketing Platform

-- 1. Admins Table
CREATE TABLE public.admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bookings Table
CREATE TABLE public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text,
  gender text,
  special_requirements text,
  pass_type text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_amount numeric NOT NULL,
  booking_status text DEFAULT 'PAYMENT_PENDING'::text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Payments Table
CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  utr text NOT NULL,
  payment_date timestamp with time zone NOT NULL,
  screenshot_url text NOT NULL,
  status text DEFAULT 'PENDING'::text NOT NULL,
  verified_by text,
  verified_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tickets Table
CREATE TABLE public.tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id text UNIQUE NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  qr_token text UNIQUE NOT NULL,
  pass_type text NOT NULL,
  status text DEFAULT 'ACTIVE'::text NOT NULL,
  pdf_url text,
  issued_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Checkins Table
CREATE TABLE public.checkins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE UNIQUE NOT NULL,
  checked_in_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  checked_in_by text NOT NULL
);

-- 6. Event Settings Table
CREATE TABLE public.event_settings (
  id text PRIMARY KEY DEFAULT 'default'::text,
  event_name text NOT NULL,
  event_date text NOT NULL,
  event_time text NOT NULL,
  venue text NOT NULL,
  address text NOT NULL,
  upi_id text NOT NULL,
  upi_qr_url text,
  early_bird_price numeric NOT NULL,
  regular_price numeric NOT NULL,
  early_bird_active boolean DEFAULT true NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS)
-- We'll allow public reads/inserts for bookings and payments, but protect other tables.
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- Public can insert bookings (create booking)
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
-- Public can view their own booking if they have the ID (we will do this server-side via service role to bypass for now)

-- Allow full access to Service Role (for server components and API routes)
-- We don't need explicit policies if we use the service_role key on the backend, 
-- but it's good practice to keep RLS active to prevent accidental exposure on anon key.
