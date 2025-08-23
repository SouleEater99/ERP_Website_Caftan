-- Create a view that automatically joins work_logs with users to get real names
CREATE OR REPLACE VIEW work_logs_with_names AS
SELECT 
  wl.id,
  wl.worker_id,
  COALESCE(u.name, wl.worker_name) as worker_name, -- Use real name if available, fallback to stored name
  wl.product,
  wl.product_id,
  wl.task,
  wl.quantity,
  wl.completed,
  wl.notes,
  wl.approved,
  wl.created_at,
  u.email as worker_email,
  u.role as worker_role
FROM work_logs wl
LEFT JOIN users u ON wl.worker_id = u.id;

-- Grant access to the view
GRANT SELECT ON work_logs_with_names TO authenticated;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_work_logs_worker_id_name ON work_logs(worker_id, worker_name);
