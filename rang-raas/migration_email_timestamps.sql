-- Add Email Tracking Timestamps
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS email_sent_at timestamptz NULL;

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS email_status text DEFAULT 'PENDING';

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS email_error text NULL;
