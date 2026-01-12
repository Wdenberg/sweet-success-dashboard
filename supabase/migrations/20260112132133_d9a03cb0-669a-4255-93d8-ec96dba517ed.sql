-- Create secure RPC function for public catalog items (without user_id exposure)
CREATE OR REPLACE FUNCTION public.get_public_catalog_items(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price numeric,
  image_url text,
  category text,
  display_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ci.id,
    ci.name,
    ci.description,
    ci.price,
    ci.image_url,
    ci.category,
    ci.display_order
  FROM public.catalog_items ci
  WHERE ci.user_id = p_user_id
    AND ci.is_active = true
  ORDER BY ci.display_order ASC;
$$;

-- Remove the overly permissive public policy that exposes user_id
DROP POLICY IF EXISTS "Anyone can view active catalog items" ON public.catalog_items;

-- Add DELETE policy for profiles (GDPR/LGPD compliance)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);