export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'master' | 'admin';
  status: 'active' | 'inactive';
}

export interface Master {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  photo_url?: string;
}

export interface Service {
  id: string;
  name: string;
  duration_min: number;
  price?: number;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  master: { id: string; name: string };
  service: { id: string; name: string; duration_min: number };
  start_at: string;
  end_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  source: 'public' | 'internal';
  notes?: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface AvailabilityResponse {
  master_id: string;
  service_id: string;
  date: string;
  slots: TimeSlot[];
}
