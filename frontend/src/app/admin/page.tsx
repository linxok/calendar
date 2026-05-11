'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Users, Scissors, Calendar, CalendarClock, BarChart2, Settings } from 'lucide-react';

interface Stats {
  masters: number;
  services: number;
  appointments: number;
  todayAppointments: number;
}

const ADMIN_LINKS = [
  { href: '/admin/masters', label: 'Masters', icon: Users, description: 'Manage salon masters', color: 'bg-blue-100 text-blue-600' },
  { href: '/admin/services', label: 'Services', icon: Scissors, description: 'Manage salon services', color: 'bg-purple-100 text-purple-600' },
  { href: '/admin/schedules', label: 'Schedules', icon: Calendar, description: 'Configure working hours', color: 'bg-green-100 text-green-600' },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarClock, description: 'View & manage bookings', color: 'bg-orange-100 text-orange-600' },
  { href: '/calendar', label: 'Calendar View', icon: BarChart2, description: 'Full calendar overview', color: 'bg-cyan-100 text-cyan-600' },
  { href: '/notifications', label: 'Notifications', icon: Settings, description: 'Notification history', color: 'bg-gray-100 text-gray-600' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ masters: 0, services: 0, appointments: 0, todayAppointments: 0 });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.allSettled([
      api.masters.list(),
      api.services.list(),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/appointments`, {
        headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}` },
      }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/appointments?date=${today}`, {
        headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}` },
      }).then((r) => r.json()),
    ]).then(([mastersRes, servicesRes, apptRes, todayRes]) => {
      setStats({
        masters: mastersRes.status === 'fulfilled' ? mastersRes.value.length : 0,
        services: servicesRes.status === 'fulfilled' ? servicesRes.value.length : 0,
        appointments: apptRes.status === 'fulfilled' ? (Array.isArray(apptRes.value) ? apptRes.value.length : 0) : 0,
        todayAppointments: todayRes.status === 'fulfilled' ? (Array.isArray(todayRes.value) ? todayRes.value.length : 0) : 0,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your beauty salon</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Masters', value: stats.masters, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Services', value: stats.services, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Total Bookings', value: stats.appointments, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Today', value: stats.todayAppointments, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(({ label, value, color, bg }) => (
            <Card key={label}>
              <CardContent className={`pt-5 pb-5 ${bg} rounded-xl`}>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-gray-600 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_LINKS.map(({ href, label, icon: Icon, description, color }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon size={20} />
                    </div>
                    <CardTitle className="text-base">{label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
