'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Scissors, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

interface AppointmentDetail {
  id: string;
  client_name: string;
  master: { id: string; name: string };
  service: { id: string; name: string; duration_min: number };
  start_at: string;
  end_at: string;
  status: string;
  notes?: string;
}

export default function ReschedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.appointments.get(id)
      .then((data) => setAppointment(data))
      .catch(() => setError('Failed to load appointment'))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!appointment || !date) return;

    setIsLoadingSlots(true);
    setSelectedSlot('');
    api.availability
      .getSlots({
        master_id: appointment.master.id,
        service_id: appointment.service.id,
        date,
      })
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setIsLoadingSlots(false));
  }, [date, appointment]);

  const handleSubmit = async () => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setError('');

    try {
      await api.appointments.update(id, {
        start_at: `${date} ${selectedSlot}`,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reschedule';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-16 text-gray-500">Loading appointment...</div>
        </main>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-16 text-red-500">Appointment not found.</div>
        </main>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.available);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reschedule Appointment</h1>

        {/* Current Appointment Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base text-gray-700">Current Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} />
              <span>{format(parseISO(appointment.start_at), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>
                {format(parseISO(appointment.start_at), 'HH:mm')} –{' '}
                {format(parseISO(appointment.end_at), 'HH:mm')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Scissors size={14} />
              <span>{appointment.service.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User size={14} />
              <span>{appointment.master.name}</span>
            </div>
          </CardContent>
        </Card>

        {/* New Date & Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select New Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                {isLoadingSlots ? (
                  <p className="text-sm text-gray-500">Loading slots...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-500">No available slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.start_time}
                        onClick={() => setSelectedSlot(slot.start_time)}
                        className={`py-2 px-1 border rounded-lg text-sm font-medium transition-colors ${
                          selectedSlot === slot.start_time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {slot.start_time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={!selectedSlot || isSubmitting}
                isLoading={isSubmitting}
              >
                Confirm Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
