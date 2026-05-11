'use client';

import { Button } from '@/components/ui/Button';
import { Clock } from 'lucide-react';

interface SuggestedSlotsProps {
  slots: string[];
  onSelect: (slot: string) => void;
  date?: string;
}

export function SuggestedSlots({ slots, onSelect, date }: SuggestedSlotsProps) {
  if (!slots || slots.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-sm text-gray-600 mb-2">
        {date ? `Available slots for ${date}:` : 'Suggested time slots:'}
      </p>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <Button
            key={slot}
            variant="outline"
            size="sm"
            onClick={() => onSelect(slot)}
            className="flex items-center gap-1"
          >
            <Clock size={14} />
            {slot}
          </Button>
        ))}
      </div>
    </div>
  );
}
