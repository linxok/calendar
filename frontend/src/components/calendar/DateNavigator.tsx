'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, startOfMonth } from 'date-fns';
import { CalendarView } from '@/types/calendar';

interface DateNavigatorProps {
  currentDate: Date;
  view: CalendarView;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({ currentDate, view, onDateChange }: DateNavigatorProps) {
  const handlePrevious = () => {
    switch (view) {
      case 'day':
        onDateChange(subDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        onDateChange(addDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDisplayText = () => {
    switch (view) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(startOfMonth(currentDate), 'MMMM yyyy');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleToday}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Go to today"
        >
          <Calendar size={20} />
        </button>
        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 min-w-[250px]">
        {getDisplayText()}
      </h2>
    </div>
  );
}
