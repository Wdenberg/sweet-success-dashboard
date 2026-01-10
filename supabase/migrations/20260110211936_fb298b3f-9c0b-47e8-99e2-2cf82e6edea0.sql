-- Add policy to allow public viewing of business name from profiles
CREATE POLICY "Anyone can view public profile info"
ON public.profiles
FOR SELECT
USING (true);