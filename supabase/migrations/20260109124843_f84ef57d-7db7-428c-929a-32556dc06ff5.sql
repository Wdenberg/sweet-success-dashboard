-- Create catalog_items table
CREATE TABLE public.catalog_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC,
  category TEXT DEFAULT 'Bolos',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own catalog items"
ON public.catalog_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own catalog items"
ON public.catalog_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own catalog items"
ON public.catalog_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own catalog items"
ON public.catalog_items FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_catalog_items_updated_at
BEFORE UPDATE ON public.catalog_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create catalog storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('catalog', 'catalog', true);

-- Storage policies for catalog bucket
CREATE POLICY "Users can upload catalog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'catalog' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their catalog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'catalog' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their catalog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'catalog' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Catalog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'catalog');