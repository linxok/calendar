'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Appointment } from '@/types/calendar';
import { format, parseISO, isToday, startOfDay, endOfDay, addDays } from 'date-fns';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle,
  XCircle,
  Clock3,
  CalendarClock,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function MasterDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'week'>('today');

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: { date?: string; from?: string; to?: string } = {};

      if (activeTab === 'today') {
        params.date = format(new Date(), 'yyyy-MM-dd');
      } else if (activeTab === 'tomorrow') {
        params.date = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      } else if (activeTab === 'week') {
        params.from = format(startOfDay(new Date()), 'yyyy-MM-dd');
        params.to = format(endOfDay(addDays(new Date(), 7)), 'yyyy-MM-dd');
      }

      const data = await api.appointments.master(params);
      setAppointments(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointments';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await api.appointments.update(id, { status: 'confirmed' });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: 'confirmed' } : apt
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm';
      alert(errorMessage);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.appointments.update(id, { status: 'completed' });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: 'completed' } : apt
        )
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete';
      alert(errorMessage);
    }
  };

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

  const todayAppointments = appointments.filter((apt) =>
    isToday(parseISO(apt.start_at))
  ).length;

  const weekRevenue = appointments
    .filter((apt) => apt.status !== 'cancelled')
    .reduce((sum, apt) => sum + (apt.price || 0), 0);

  const pendingCount = appointments.filter((apt) => apt.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Master Dashboard</h1>
          <p className="text-gray-600">Manage your schedule and appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarClock size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{todayAppointments}</p>
                  <p className="text-sm text-gray-600">Today&apos;s Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock3 size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-600">Pending</p>
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
                  <p className="text-sm text-gray-600">Completed This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${weekRevenue}</p>
                  <p className="text-sm text-gray-600">Week Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Appointments</CardTitle>
                  <Link href="/calendar">
                    <Button size="sm" variant="outline">
                      <Calendar size={16} className="mr-2" />
                      Full Calendar
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('today')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'today'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setActiveTab('tomorrow')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'tomorrow'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    onClick={() => setActiveTab('week')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'week'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    This Week
                  </button>
                </div>

                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      No appointments for {activeTab === 'today' ? 'today' : activeTab === 'tomorrow' ? 'tomorrow' : 'this week'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
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
                              <span className="text-gray-600 font-medium">
                                {format(parseISO(appointment.start_at), 'EEEE, MMM d')}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" />
                                <span className="font-semibold">
                                  {format(parseISO(appointment.start_at), 'HH:mm')} -{' '}
                                  {format(parseISO(appointment.end_at), 'HH:mm')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Scissors size={14} className="text-gray-400" />
                                <span>{appointment.service_name}</span>
                                {appointment.service_duration && (
                                  <span className="text-gray-500">
                                    ({appointment.service_duration} min)
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                <span className="font-medium">{appointment.client_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <span>{appointment.client_phone}</span>
                              </div>
                            </div>

                            {appointment.notes && (
                              <p className="mt-3 text-sm text-gray-600 italic bg-white/50 p-2 rounded">
                                Note: {appointment.notes}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {appointment.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirm(appointment.id)}
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Confirm
                              </Button>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleComplete(appointment.id)}
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total This Week</span>
                  <span className="font-semibold">{appointments.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700">Confirmed</span>
                  <span className="font-semibold text-green-700">
                    {appointments.filter((a) => a.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-700">Pending</span>
                  <span className="font-semibold text-yellow-700">{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700">Cancelled</span>
                  <span className="font-semibold text-red-700">
                    {appointments.filter((a) => a.status === 'cancelled').length}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Working Hours Today</p>
                  <p className="text-lg font-semibold">9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {todayAppointments} appointments scheduled
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
