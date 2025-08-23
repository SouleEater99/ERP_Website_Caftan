export interface WorkLog {
  id: string;
  worker_id: string;
  worker_name: string;
  product: string;
  product_id?: string;
  task: string;
  quantity: number;
  completed: boolean;
  notes?: string;
  approved: boolean;
  created_at?: string;
}

export interface WorkForm {
  product: string;
  product_id?: string;
  task: string;
  quantity: number;
  completed: boolean;
  notes?: string;
}

export interface Product {
  value: string;
  label: string;
  icon: string;
}

export interface Task {
  value: string;
  label: string;
  icon: string;
  color: string;
  desc: string;
}
