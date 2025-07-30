-- Migration: Add attachment support to messages table
-- Run this in Supabase SQL Editor

-- Add attachment columns to messages table
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_type TEXT CHECK (attachment_type IN ('image', 'file')),
ADD COLUMN IF NOT EXISTS attachment_name TEXT;

-- Create storage bucket for message attachments (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message attachments
-- Policy 1: Anyone can view attachments (since bucket is public)
CREATE POLICY "Message attachments are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'message-attachments');

-- Policy 2: Authenticated users can upload attachments
CREATE POLICY "Authenticated users can upload message attachments"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'message-attachments' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Users can update their own attachments
CREATE POLICY "Users can update their own message attachments"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'message-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[2]  -- Assumes path: trips/{tripId}/messages/{fileId}
);

-- Policy 4: Users can delete their own attachments
CREATE POLICY "Users can delete their own message attachments"  
ON storage.objects FOR DELETE
USING (
  bucket_id = 'message-attachments'
  AND auth.uid()::text = (storage.foldername(name))[2]
);

-- Add index for attachment queries
CREATE INDEX IF NOT EXISTS idx_messages_attachment_url ON public.messages(attachment_url) WHERE attachment_url IS NOT NULL;

-- Migration completed successfully
SELECT 'Message attachments migration completed successfully' as result;