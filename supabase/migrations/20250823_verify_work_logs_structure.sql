-- Verify and fix work_logs table structure

-- Step 1: Check current structure
-- The work_logs table should have:
-- - worker_id uuid REFERENCES users(id)
-- - worker_name text (for display purposes)

-- Step 2: Ensure the foreign key constraint is properly set
ALTER TABLE work_logs DROP CONSTRAINT IF EXISTS work_logs_worker_id_fkey;
ALTER TABLE work_logs ADD CONSTRAINT work_logs_worker_id_fkey 
  FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL;

-- Step 3: Make worker_id nullable (in case you want to allow anonymous work logs)
ALTER TABLE work_logs ALTER COLUMN worker_id DROP NOT NULL;

-- Step 4: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_logs_worker_id ON work_logs(worker_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_created_at ON work_logs(created_at);
