-- Add policy to allow public viewing of active catalog items
CREATE POLICY "Anyone can view active catalog items"
ON public.catalog_items
FOR SELECT
USING (is_active = true);