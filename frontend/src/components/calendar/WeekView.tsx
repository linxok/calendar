'use client';

import { WeekViewData, Appointment } from '@/types/calendar';
import { AppointmentCard } from './AppointmentCard';
import { format, parseISO, addDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';

interface WeekViewProps {
  data: WeekViewData;
  onAppointmentClick?: (appointment: Appointment) => void;
  selectedMasterId?: string;
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeekView({ data, onAppointmentClick, selectedMasterId }: WeekViewProps) {
  const weekStart = parseISO(data.week_start);

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 bg-gray-50 font-medium text-sm">Master</div>
        {data.days.map((day, index) => {
          const date = addDays(weekStart, index);
          const isToday = format(new Date(), 'yyyy-MM-dd') === day.date;

          return (
            <div
              key={day.date}
              className={`p-4 text-center ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}
            >
              <div className="text-xs text-gray-500 uppercase">{dayNames[index]}</div>
              <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                {format(date, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="divide-y">
        {data.days[0]?.masters.map((master) => {
          if (selectedMasterId && master.master_id !== selectedMasterId) {
            return null;
          }

          return (
            <div key={master.master_id} className="grid grid-cols-8">
              <div className="p-4 bg-gray-50 font-medium text-sm flex items-center">
                {master.master_name}
              </div>
              {data.days.map((day) => {
                const dayMaster = day.masters.find((m) => m.master_id === master.master_id);
                const appointments = dayMaster?.appointments || [];

                return (
                  <div
                    key={`${day.date}-${master.master_id}`}
                    className="p-2 min-h-[120px] border-l bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-2">
                      {appointments.map((apt) => (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          onClick={onAppointmentClick}
                          compact
                        />
                      ))}
                      {appointments.length === 0 && (
                        <div className="text-center text-gray-300 text-xs py-4">
                          <CalendarDays size={16} className="mx-auto mb-1" />
                          No appts
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
