export interface Notification {
  id: string;
  appointment_id: string;
  channel: 'email' | 'telegram' | 'sms';
  type: 'booking_confirmation' | 'reminder' | 'cancellation' | 'reschedule';
  recipient: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'queued';
  provider?: string;
  provider_id?: string;
  error_message?: string;
  sent_at: string;
  delivered_at?: string;
  read_at?: string;
  created_at: string;
}

export interface NotificationStats {
  channel: string;
  total: number;
  delivered: number;
  failed: number;
  read: number;
}

export interface NotificationSettings {
  email_enabled: boolean;
  telegram_enabled: boolean;
  sms_enabled: boolean;
  booking_confirmation: boolean;
  reminders: boolean;
  cancellations: boolean;
  marketing: boolean;
}
