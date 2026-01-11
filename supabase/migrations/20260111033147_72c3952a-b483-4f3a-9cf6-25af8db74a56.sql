-- Remove the overly permissive policy we just created
DROP POLICY IF EXISTS "Anyone can view catalog settings" ON public.profiles;

-- Drop the view as we'll use an RPC function instead
DROP VIEW IF EXISTS public.public_catalog_profiles;

-- Create a secure function that returns only catalog-related fields
CREATE OR REPLACE FUNCTION public.get_public_catalog_profile(p_user_id uuid)
RETURNS TABLE (
  business_name text,
  catalog_logo_url text,
  catalog_banner_url text,
  catalog_primary_color text,
  catalog_secondary_color text,
  catalog_background_color text,
  catalog_text_color text,
  catalog_show_prices boolean,
  catalog_whatsapp text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.business_name,
    p.catalog_logo_url,
    p.catalog_banner_url,
    p.catalog_primary_color,
    p.catalog_secondary_color,
    p.catalog_background_color,
    p.catalog_text_color,
    p.catalog_show_prices,
    p.catalog_whatsapp
  FROM public.profiles p
  WHERE p.user_id = p_user_id
  LIMIT 1;
$$;