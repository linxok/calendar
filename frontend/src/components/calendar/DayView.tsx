'use client';

import { DayViewData, Appointment } from '@/types/calendar';
import { AppointmentCard } from './AppointmentCard';
import { format, parseISO } from 'date-fns';
import { User } from 'lucide-react';

interface DayViewProps {
  data: DayViewData;
  onAppointmentClick?: (appointment: Appointment) => void;
  selectedMasterId?: string;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ data, onAppointmentClick, selectedMasterId }: DayViewProps) {
  const filteredMasters = selectedMasterId
    ? data.masters.filter((m) => m.master_id === selectedMasterId)
    : data.masters;

  const getAppointmentsForHour = (appointments: Appointment[], hour: number) => {
    return appointments.filter((a) => {
      const startHour = parseISO(a.start_at).getHours();
      return startHour === hour;
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">
          {data.day_of_week}, {format(parseISO(data.date), 'MMMM d')}
        </h3>
      </div>

      <div className="divide-y">
        {filteredMasters.map((master) => (
          <div key={master.master_id} className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <span className="font-medium">{master.master_name}</span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              {timeSlots.map((hour) => {
                const appointments = getAppointmentsForHour(master.appointments, hour);
                const hasAppointments = appointments.length > 0;

                return (
                  <div
                    key={hour}
                    className={`col-span-1 p-2 rounded text-center text-xs ${
                      hasAppointments
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <div className="font-medium text-gray-600">{hour}:00</div>
                    {appointments.map((apt) => (
                      <div key={apt.id} className="mt-1">
                        <AppointmentCard
                          appointment={apt}
                          onClick={onAppointmentClick}
                          compact
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredMasters.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No masters or appointments for this day.
        </div>
      )}
    </div>
  );
}
