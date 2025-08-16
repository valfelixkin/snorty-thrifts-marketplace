-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create ads table
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advertiser_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  target_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  location TEXT,
  budget DECIMAL(10,2) NOT NULL,
  daily_budget DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view active ads" 
ON public.ads 
FOR SELECT 
USING (is_active = true AND status = 'active' AND (end_date IS NULL OR end_date > now()));

CREATE POLICY "Users can create their own ads" 
ON public.ads 
FOR INSERT 
WITH CHECK (auth.uid() = advertiser_id);

CREATE POLICY "Users can update their own ads" 
ON public.ads 
FOR UPDATE 
USING (auth.uid() = advertiser_id);

CREATE POLICY "Users can view their own ads" 
ON public.ads 
FOR SELECT 
USING (auth.uid() = advertiser_id);

CREATE POLICY "Admins can manage all ads" 
ON public.ads 
FOR ALL 
USING (get_current_user_role() = 'admin'::user_role);

-- Create trigger for updated_at
CREATE TRIGGER update_ads_updated_at
BEFORE UPDATE ON public.ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_ads_active ON public.ads (is_active, status) WHERE is_active = true;
CREATE INDEX idx_ads_advertiser ON public.ads (advertiser_id);
CREATE INDEX idx_ads_category ON public.ads (category);
CREATE INDEX idx_ads_location ON public.ads (location);