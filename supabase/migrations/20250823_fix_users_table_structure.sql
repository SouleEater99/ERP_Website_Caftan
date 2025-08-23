-- Fix the users table structure to properly link with Supabase Auth

-- Step 1: Drop the unused worker_id column (it's not needed)
ALTER TABLE users DROP COLUMN IF EXISTS worker_id;

-- Step 2: Ensure the id column is properly set as UUID primary key
-- (This should already be correct, but let's verify)
ALTER TABLE users ALTER COLUMN id TYPE uuid USING id::uuid;

-- Step 3: Add your current user with the correct ID
INSERT INTO users (id, email, name, role, created_at)
VALUES (
  'a9b88bd7-ccf3-48cd-9f7a-095836406eb2',  -- Your actual Supabase Auth user ID
  'worker1@caftantalia.com',                 -- Your email
  'فاطمة حسن علي',                            -- Your actual name
  'worker',                                  -- Your role
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Step 4: Add any other existing users you have
-- Replace these with your actual user data
INSERT INTO users (id, email, name, role, created_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'worker2@caftantalia.com', 'Worker Two', 'worker', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'worker3@caftantalia.com', 'Worker Three', 'worker', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'supervisor@caftantalia.com', 'Supervisor', 'supervisor', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'admin@caftantalia.com', 'Administrator', 'admin', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Step 5: Verify the foreign key constraint in work_logs is correct
-- (This should already be set up correctly)
