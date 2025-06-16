
-- Create live_events table
CREATE TABLE IF NOT EXISTS public.live_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  speaker text,
  speaker_link text,
  event_date timestamp with time zone NOT NULL,
  description text,
  location text DEFAULT 'Wilbe Live Stream - https://wilbe.com',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active events
CREATE POLICY "Public can view active live events" ON public.live_events
  FOR SELECT USING (is_active = true);

-- Allow admins full access
CREATE POLICY "Admins can manage live events" ON public.live_events
  FOR ALL USING (public.is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_live_events_updated_at
  BEFORE UPDATE ON public.live_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a sample event (the current hardcoded one)
INSERT INTO public.live_events (title, speaker, speaker_link, event_date, description, is_active)
VALUES (
  'Ep 6: From PhD War Models to an AI x Defense Exit',
  'Sean Gourley',
  'https://x.com/sgourley',
  '2025-06-17T16:00:00Z',
  'Join Sean Gourley discussing breakthrough insights in AI-powered defense applications and his entrepreneurial journey from PhD research to successful exit. Learn from leading scientists about the latest developments in the intersection of AI and defense technology.',
  true
);
