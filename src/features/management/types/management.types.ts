export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  worker_id?: string;
  created_at?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  worker_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  worker_id?: string;
  password: string;
}

export interface LocationFormData {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  country: string;
}

export interface LocationUpdateData {
  id: string;
  updates: Partial<Location>;
}