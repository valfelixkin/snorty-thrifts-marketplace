
-- Create returns table
CREATE TABLE public.returns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'processed')),
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create return_media table for images/videos
CREATE TABLE public.return_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id UUID REFERENCES public.returns(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for returns
CREATE POLICY "Users can view their own returns" ON public.returns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own returns" ON public.returns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own returns" ON public.returns
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for return_media
CREATE POLICY "Users can view media for their returns" ON public.return_media
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.returns 
    WHERE returns.id = return_media.return_id 
    AND returns.user_id = auth.uid()
  ));

CREATE POLICY "Users can create media for their returns" ON public.return_media
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.returns 
    WHERE returns.id = return_media.return_id 
    AND returns.user_id = auth.uid()
  ));
