-- Add approval tracking fields to work_logs table
ALTER TABLE work_logs 
ADD COLUMN IF NOT EXISTS approver_notes text,
ADD COLUMN IF NOT EXISTS approved_at timestamptz,
ADD COLUMN IF NOT EXISTS approver_id uuid REFERENCES users(id);

-- Create work_logs_with_names view
CREATE OR REPLACE VIEW work_logs_with_names AS
SELECT 
  wl.*,
  COALESCE(u.name, wl.worker_name) as actual_worker_name
FROM work_logs wl
LEFT JOIN users u ON wl.worker_id = u.id;

-- Grant permissions
GRANT SELECT ON work_logs_with_names TO authenticated;
