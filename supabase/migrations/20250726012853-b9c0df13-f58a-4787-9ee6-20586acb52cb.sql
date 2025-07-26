-- Create storage bucket for form files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('form-files', 'form-files', true);

-- Storage policies for form files
CREATE POLICY "Anyone can upload files to form-files bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'form-files');

CREATE POLICY "Anyone can view files in form-files bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'form-files');

CREATE POLICY "Form owners can update files in their forms" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'form-files');

CREATE POLICY "Form owners can delete files in their forms" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'form-files');