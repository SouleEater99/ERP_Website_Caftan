-- Fix the work_logs foreign key issue by ensuring users exist
-- First, let's check if we need to create a users table or just add the missing user

-- Insert the current authenticated user into the users table
-- Replace 'your-user-id-here' with your actual user ID from Supabase Auth
INSERT INTO users (id, email, name, role, created_at)
VALUES (
  'your-user-id-here', -- Replace this with your actual user ID
  'admin@example.com',  -- Replace with your actual email
  'Administrator',      -- Replace with your actual name
  'admin',              -- Replace with your actual role
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Also, let's make sure the work_logs table can handle the case where worker_id might not exist
-- We can either:
-- 1. Make worker_id nullable (if workers can be anonymous)
-- 2. Ensure all authenticated users exist in the users table

-- For now, let's make worker_id nullable to fix the immediate issue
ALTER TABLE work_logs ALTER COLUMN worker_id DROP NOT NULL;
