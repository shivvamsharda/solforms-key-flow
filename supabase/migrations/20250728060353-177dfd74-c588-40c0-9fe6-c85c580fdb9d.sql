-- Add accepting_responses column to forms table
ALTER TABLE public.forms 
ADD COLUMN accepting_responses boolean NOT NULL DEFAULT true;