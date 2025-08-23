-- Fix work_logs table constraints to allow work logs without requiring user records

-- Step 1: Drop the foreign key constraint
ALTER TABLE work_logs DROP CONSTRAINT IF EXISTS work_logs_worker_id_fkey;

-- Step 2: Make worker_id nullable
ALTER TABLE work_logs ALTER COLUMN worker_id DROP NOT NULL;

-- Step 3: Add a comment explaining the change
COMMENT ON COLUMN work_logs.worker_id IS 'Worker ID from users table. Can be NULL for anonymous work logs.';

-- Step 4: Create a new foreign key constraint that allows NULL values
ALTER TABLE work_logs ADD CONSTRAINT work_logs_worker_id_fkey 
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL;

-- Step 5: Update existing work_logs to handle NULL worker_ids gracefully
UPDATE work_logs SET worker_id = NULL WHERE worker_id NOT IN (SELECT id FROM users);

-- Step 6: Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_work_logs_worker_id ON work_logs(worker_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_created_at ON work_logs(created_at);
