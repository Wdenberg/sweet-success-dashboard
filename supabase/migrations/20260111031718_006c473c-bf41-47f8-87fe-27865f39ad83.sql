-- Add catalog customization fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN catalog_logo_url text,
ADD COLUMN catalog_banner_url text,
ADD COLUMN catalog_primary_color text DEFAULT '#EC4899',
ADD COLUMN catalog_secondary_color text DEFAULT '#F472B6',
ADD COLUMN catalog_background_color text DEFAULT '#FFFFFF',
ADD COLUMN catalog_text_color text DEFAULT '#1F2937',
ADD COLUMN catalog_show_prices boolean DEFAULT true,
ADD COLUMN catalog_whatsapp text;