'use client';

import { Appointment } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onDateChange: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onDayClick?: (date: Date) => void;
}

export function MonthView({ currentDate, appointments, onDateChange, onDayClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter((apt) => apt.start_at.startsWith(dateStr));
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onDateChange(addDays(monthStart, -1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={() => onDateChange(addDays(monthEnd, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {weekDays.map((dayName) => (
          <div
            key={dayName}
            className="p-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-b"
          >
            {dayName}
          </div>
        ))}

        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, monthStart);
          const isTodayDate = isToday(date);
          const dayAppointments = getAppointmentsForDay(date);

          return (
            <div
              key={index}
              onClick={() => onDayClick?.(date)}
              className={`min-h-[100px] p-2 border-b border-r cursor-pointer transition-colors ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isTodayDate ? 'bg-blue-50' : ''} hover:bg-gray-50`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isTodayDate
                    ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center'
                    : isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {format(date, 'd')}
              </div>

              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className={`text-xs px-2 py-1 rounded truncate ${
                      apt.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : apt.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {format(parseISO(apt.start_at), 'HH:mm')} {apt.client_name}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
