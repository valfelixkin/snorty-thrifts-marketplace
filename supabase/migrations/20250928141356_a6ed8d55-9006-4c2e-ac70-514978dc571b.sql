-- Add location fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Kenya',
ADD COLUMN IF NOT EXISTS location_permissions TEXT DEFAULT 'not_requested' CHECK (location_permissions IN ('not_requested', 'granted', 'denied', 'manual')),
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE;

-- Add location fields to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT;

-- Create indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles (city);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON public.profiles (region);
CREATE INDEX IF NOT EXISTS idx_products_city ON public.products (city);
CREATE INDEX IF NOT EXISTS idx_products_region ON public.products (region);
CREATE INDEX IF NOT EXISTS idx_profiles_lat_lng ON public.profiles (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_products_lat_lng ON public.products (latitude, longitude);

-- Function to calculate distance between two points using Haversine formula
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL(10,8), 
  lng1 DECIMAL(11,8), 
  lat2 DECIMAL(10,8), 
  lng2 DECIMAL(11,8)
) 
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    6371 * acos(
      LEAST(1.0, 
        cos(radians(lat1)) * 
        cos(radians(lat2)) * 
        cos(radians(lng2) - radians(lng1)) + 
        sin(radians(lat1)) * 
        sin(radians(lat2))
      )
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;