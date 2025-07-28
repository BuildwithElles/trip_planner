-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('trip-photos', 'trip-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('trip-receipts', 'trip-receipts', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for trip photos (public bucket)
CREATE POLICY "Trip members can view photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trip-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT trip_id::text FROM public.trip_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'trip-photos' AND
  (storage.foldername(name))[1] IN (
    SELECT trip_id::text FROM public.trip_users WHERE user_id = auth.uid()
  ) AND
  auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Photo uploaders and admins can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trip-photos' AND
  (
    auth.uid()::text = (storage.foldername(name))[2] OR
    (storage.foldername(name))[1] IN (
      SELECT trip_id::text FROM public.trip_users 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Storage policies for trip receipts (private bucket)
CREATE POLICY "Trip members can view receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trip-receipts' AND
  (storage.foldername(name))[1] IN (
    SELECT trip_id::text FROM public.trip_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Trip members can upload receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'trip-receipts' AND
  (storage.foldername(name))[1] IN (
    SELECT trip_id::text FROM public.trip_users WHERE user_id = auth.uid()
  ) AND
  auth.uid()::text = (storage.foldername(name))[2]
);

CREATE POLICY "Receipt uploaders and admins can delete receipts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trip-receipts' AND
  (
    auth.uid()::text = (storage.foldername(name))[2] OR
    (storage.foldername(name))[1] IN (
      SELECT trip_id::text FROM public.trip_users 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
); 