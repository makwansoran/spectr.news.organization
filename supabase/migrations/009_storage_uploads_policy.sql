-- Storage policies for the "uploads" bucket (article images).
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run.
-- Ensures uploads from your API and public read of images work.

-- Allow insert into storage.objects for the uploads bucket
DROP POLICY IF EXISTS "Allow uploads to uploads bucket" ON storage.objects;
CREATE POLICY "Allow uploads to uploads bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'uploads');

-- Allow public read (so article images load for everyone)
DROP POLICY IF EXISTS "Public read for uploads bucket" ON storage.objects;
CREATE POLICY "Public read for uploads bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'uploads');
