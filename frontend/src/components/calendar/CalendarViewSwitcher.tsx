'use client';

import { CalendarView } from '@/types/calendar';
import { CalendarDays, CalendarRange, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewSwitcherProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const views: { id: CalendarView; label: string; icon: typeof CalendarIcon }[] = [
  { id: 'day', label: 'Day', icon: CalendarDays },
  { id: 'week', label: 'Week', icon: CalendarRange },
  { id: 'month', label: 'Month', icon: CalendarIcon },
];

export function CalendarViewSwitcher({ currentView, onViewChange }: CalendarViewSwitcherProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
