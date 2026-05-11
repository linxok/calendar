'use client';

import { Appointment } from '@/types/calendar';
import { format, parseISO } from 'date-fns';
import { Clock, User, Phone, Scissors } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: (appointment: Appointment) => void;
  compact?: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  confirmed: 'bg-green-100 border-green-300 text-green-800',
  completed: 'bg-blue-100 border-blue-300 text-blue-800',
  cancelled: 'bg-gray-100 border-gray-300 text-gray-500 line-through',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function AppointmentCard({ appointment, onClick, compact = false }: AppointmentCardProps) {
  const startTime = format(parseISO(appointment.start_at), 'HH:mm');
  const endTime = format(parseISO(appointment.end_at), 'HH:mm');

  if (compact) {
    return (
      <div
        onClick={() => onClick?.(appointment)}
        className={`p-2 rounded border cursor-pointer hover:shadow-md transition-shadow ${
          statusColors[appointment.status]
        }`}
      >
        <div className="flex items-center gap-1 text-xs font-medium">
          <Clock size={12} />
          {startTime} - {endTime}
        </div>
        <div className="text-xs truncate">{appointment.client_name}</div>
        <div className="text-xs text-gray-600 truncate">{appointment.service_name}</div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(appointment)}
      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
        statusColors[appointment.status]
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="font-semibold">
            {startTime} - {endTime}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full bg-white/50`}>
          {statusLabels[appointment.status]}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} />
          <span className="font-medium">{appointment.client_name}</span>
        </div>
        {appointment.client_phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>{appointment.client_phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Scissors size={14} />
          <span>{appointment.service_name}</span>
        </div>
      </div>

      {appointment.notes && (
        <p className="mt-2 text-xs text-gray-500 italic">{appointment.notes}</p>
      )}
    </div>
  );
}
