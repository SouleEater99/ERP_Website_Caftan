-- Add existing Supabase Auth users to the users table
-- Replace the UUIDs with your actual user IDs

-- Add worker1@caftantalia.com
INSERT INTO users (id, email, name, role, created_at)
VALUES (
  'a3b40a91-8d98-4359-9d34-9f6e0ca262aa',  -- Replace with your actual user ID
  'worker1@caftantalia.com',
  'Worker One',
  'worker',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Add admin@caftantalia.com (if you have one)
INSERT INTO users (id, email, name, role, created_at)
VALUES (
  'your-admin-user-id-here',  -- Replace with your actual admin user ID
  'admin@caftantalia.com',
  'Administrator',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Add any other existing users here
