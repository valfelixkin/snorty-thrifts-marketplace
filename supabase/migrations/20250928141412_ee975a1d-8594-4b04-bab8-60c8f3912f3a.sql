-- Fix the function security issue by setting search_path
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL(10,8), 
  lng1 DECIMAL(11,8), 
  lat2 DECIMAL(10,8), 
  lng2 DECIMAL(11,8)
) 
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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