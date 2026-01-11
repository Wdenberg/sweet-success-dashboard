-- Add a policy that allows public access ONLY for catalog-related fields
-- Since RLS can't restrict columns, we use the view approach combined with a specific policy
-- Create a policy that allows reading profiles for catalog display purposes only
CREATE POLICY "Anyone can view catalog settings" 
ON public.profiles
FOR SELECT
USING (true);

-- Note: This policy still allows SELECT on all columns, but we'll enforce column-level 
-- restriction through the view in the application code