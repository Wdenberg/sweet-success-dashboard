-- Drop the existing view
DROP VIEW IF EXISTS public.public_catalog_profiles;

-- Recreate the view with SECURITY INVOKER (default, explicit for clarity)
CREATE VIEW public.public_catalog_profiles 
WITH (security_invoker = true)
AS
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