export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  master_id?: string;
  master_name: string;
  service_id?: string;
  service_name: string;
  service_duration?: number;
  start_at: string;
  end_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price?: number;
  source?: string;
}

export interface MasterSchedule {
  master_id: string;
  master_name: string;
  appointments: Appointment[];
}

export interface DayViewData {
  date: string;
  day_of_week: string;
  masters: MasterSchedule[];
}

export interface WeekViewData {
  week_start: string;
  week_end: string;
  days: DayViewData[];
}

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarFilters {
  master_id?: string;
  status?: string;
}
