'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Appointment } from '@/types/calendar';
import { format, parseISO, isPast, isFuture, isToday } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  Scissors,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  CalendarClock,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await api.appointments.my();
      setAppointments(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointments';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.appointments.cancel(id);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: 'cancelled' } : apt
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel appointment';
      alert(errorMessage);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = parseISO(apt.start_at);
    if (activeTab === 'upcoming') {
      return isFuture(aptDate) || isToday(aptDate);
    }
    return isPast(aptDate) && !isToday(aptDate);
  });

  const upcomingCount = appointments.filter((apt) => {
    const aptDate = parseISO(apt.start_at);
    return (isFuture(aptDate) || isToday(aptDate)) && apt.status !== 'cancelled';
  }).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock3 size={16} className="text-yellow-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarClock size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingCount}</p>
                  <p className="text-sm text-gray-600">Upcoming Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {appointments.filter((a) => a.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed Visits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scissors size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Appointments</CardTitle>
              <Link href="/booking">
                <Button size="sm">+ Book New</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Past ({appointments.length - upcomingCount})
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  {activeTab === 'upcoming'
                    ? 'No upcoming appointments. Book your first visit!'
                    : 'No past appointments yet.'}
                </p>
                {activeTab === 'upcoming' && (
                  <Link href="/booking">
                    <Button>Book Appointment</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`p-4 rounded-lg border ${getStatusColor(appointment.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(appointment.status)}
                          <span className="font-semibold capitalize">
                            {appointment.status}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600">
                            {format(parseISO(appointment.start_at), 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            <span>
                              {format(parseISO(appointment.start_at), 'HH:mm')} -{' '}
                              {format(parseISO(appointment.end_at), 'HH:mm')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Scissors size={14} className="text-gray-400" />
                            <span>{appointment.service_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span>{appointment.master_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span>Main Salon</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="mt-3 text-sm text-gray-600 italic">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {(appointment.status === 'confirmed' ||
                          appointment.status === 'pending') &&
                          activeTab === 'upcoming' && (
                            <>
                              <Link href={`/booking/reschedule/${appointment.id}`}>
                                <Button size="sm" variant="outline">
                                  Reschedule
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancel(appointment.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
