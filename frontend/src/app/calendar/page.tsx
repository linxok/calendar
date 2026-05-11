'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek } from 'date-fns';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import {
  CalendarViewSwitcher,
  DateNavigator,
  DayView,
  WeekView,
  MonthView,
} from '@/components/calendar';
import { CalendarView, DayViewData, WeekViewData, Appointment } from '@/types/calendar';
import { api } from '@/lib/api';
import { Filter, Download } from 'lucide-react';

export default function CalendarPage() {
  const [view, setView] = useState<CalendarView>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dayData, setDayData] = useState<DayViewData | null>(null);
  const [weekData, setWeekData] = useState<WeekViewData | null>(null);
  const [monthAppointments, setMonthAppointments] = useState<Appointment[]>([]);
  const [masters, setMasters] = useState<{ id: string; name: string }[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    api.masters.list().then((data) => setMasters(data));
  }, []);

  useEffect(() => {
    fetchCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentDate]);

  const fetchCalendarData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');

      switch (view) {
        case 'day': {
          const data = await api.calendar.daily(dateStr);
          setDayData(data);
          break;
        }
        case 'week': {
          const weekStart = format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
          const data = await api.calendar.weekly(weekStart);
          setWeekData(data);
          break;
        }
        case 'month': {
          const start = format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
          const data = await api.calendar.weekly(start);
          const allAppointments = data.days.flatMap((day: DayViewData) =>
            day.masters.flatMap((m) => m.appointments)
          );
          setMonthAppointments(allAppointments);
          break;
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load calendar data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    console.log('Appointment clicked:', appointment);
    // TODO: Open appointment details modal
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const renderCalendarView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading calendar...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">{error}</div>
        </div>
      );
    }

    switch (view) {
      case 'day':
        return dayData ? (
          <DayView
            data={dayData}
            onAppointmentClick={handleAppointmentClick}
            selectedMasterId={selectedMasterId}
          />
        ) : null;
      case 'week':
        return weekData ? (
          <WeekView
            data={weekData}
            onAppointmentClick={handleAppointmentClick}
            selectedMasterId={selectedMasterId}
          />
        ) : null;
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            appointments={monthAppointments}
            onDateChange={setCurrentDate}
            onDayClick={handleDayClick}
            onAppointmentClick={handleAppointmentClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View and manage appointments</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CalendarViewSwitcher currentView={view} onViewChange={setView} />
            <DateNavigator currentDate={currentDate} view={view} onDateChange={setCurrentDate} />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedMasterId}
              onChange={(e) => setSelectedMasterId(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="">All Masters</option>
              {masters.map((master) => (
                <option key={master.id} value={master.id}>
                  {master.name}
                </option>
              ))}
            </select>

            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>

            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>

            <Button size="sm">+ New Appointment</Button>
          </div>
        </div>

        {renderCalendarView()}
      </main>
    </div>
  );
}
