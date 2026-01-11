-- Remove the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view public profile info" ON public.profiles;

-- Create a view that exposes only catalog-related public fields
CREATE OR REPLACE VIEW public.public_catalog_profiles AS
SELECT 
  user_id,
  business_name,
  catalog_logo_url,
  catalog_banner_url,
  catalog_primary_color,
  catalog_secondary_color,
  catalog_background_color,
  catalog_text_color,
  catalog_show_prices,
  catalog_whatsapp
FROM public.profiles;

-- Grant select on the view to anonymous and authenticated users
GRANT SELECT ON public.public_catalog_profiles TO anon, authenticated;