-- Add status field to afd_submissions table
ALTER TABLE public.afd_submissions 
ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing submissions to have pending status
UPDATE public.afd_submissions 
SET status = 'pending' 
WHERE status IS NULL;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_afd_submissions_status ON public.afd_submissions(status);
CREATE INDEX IF NOT EXISTS idx_afd_submissions_user_id ON public.afd_submissions(user_id);

-- Add policy for admins to update submission status
CREATE POLICY "Admins can update submission status" ON public.afd_submissions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
); 