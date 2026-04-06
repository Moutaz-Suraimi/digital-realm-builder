
-- Website sections table for page builder
CREATE TABLE public.website_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  custom_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sections" ON public.website_sections
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage sections" ON public.website_sections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site content table for inline editing
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  value TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section_key, content_key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage content" ON public.site_content
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_website_sections_updated_at
  BEFORE UPDATE ON public.website_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default sections
INSERT INTO public.website_sections (section_key, display_name, display_order, is_visible) VALUES
  ('hero', 'Hero Section', 0, true),
  ('about', 'About Us', 1, true),
  ('solutions', 'Solutions', 2, true),
  ('services', 'Services', 3, true),
  ('portfolio', 'Portfolio', 4, true),
  ('packages', 'Packages', 5, true),
  ('testimonials', 'Testimonials', 6, true),
  ('blog', 'Blog / News', 7, true),
  ('faq', 'FAQ', 8, true),
  ('contact', 'Contact', 9, true);

-- Media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
