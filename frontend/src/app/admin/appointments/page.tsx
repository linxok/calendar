'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Clock3, AlertCircle, Filter } from 'lucide-react';
import { Appointment } from '@/types/calendar';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [masters, setMasters] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterMaster, setFilterMaster] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    api.masters.list().then(setMasters).catch(console.error);
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, filterMaster]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterDate) params.date = filterDate;
      if (filterMaster) params.master_id = filterMaster;
      const query = new URLSearchParams(params).toString();
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/appointments${query ? `?${query}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
          },
        }
      ).then((r) => r.json());
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.appointments.update(id, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as Appointment['status'] } : a))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.appointments.cancel(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to cancel');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} className="text-green-600" />;
      case 'pending': return <Clock3 size={14} className="text-yellow-600" />;
      case 'cancelled': return <XCircle size={14} className="text-red-600" />;
      case 'completed': return <CheckCircle size={14} className="text-blue-600" />;
      default: return <AlertCircle size={14} className="text-gray-600" />;
    }
  };

  const filtered = appointments.filter((a) =>
    filterStatus ? a.status === filterStatus : true
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 text-sm">View and manage all salon appointments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Filter size={16} className="text-gray-500" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterMaster}
                onChange={(e) => setFilterMaster(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Masters</option>
                {masters.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {(filterDate || filterMaster || filterStatus) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setFilterDate(''); setFilterMaster(''); setFilterStatus(''); }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {filtered.length} Appointment{filtered.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No appointments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Date & Time</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Client</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Master</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Service</th>
                      <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((appt) => (
                      <tr key={appt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {format(parseISO(appt.start_at), 'MMM d, yyyy')}
                          </div>
                          <div className="text-gray-500">
                            {format(parseISO(appt.start_at), 'HH:mm')} – {format(parseISO(appt.end_at), 'HH:mm')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{appt.client_name}</div>
                          <div className="text-gray-500">{appt.client_phone}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{appt.master_name}</td>
                        <td className="px-6 py-4 text-gray-600">{appt.service_name}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[appt.status] || ''}`}
                          >
                            {getStatusIcon(appt.status)}
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {appt.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(appt.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                            )}
                            {appt.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(appt.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                            {(appt.status === 'pending' || appt.status === 'confirmed') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancel(appt.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
