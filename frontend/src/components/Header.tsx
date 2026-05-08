'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/NotificationBell';
import { Calendar, Scissors, Sparkles, LayoutDashboard, Briefcase, ShieldCheck } from 'lucide-react';

export function Header() {
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Beauty Salon Booking
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/booking"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Scissors size={18} />
              <span className="hidden sm:inline">Book Now</span>
            </Link>

            <Link
              href="/calendar"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Calendar</span>
            </Link>

            <Link
              href="/ai-assistant"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <Sparkles size={18} />
              <span className="hidden sm:inline">AI Assistant</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-rose-600 hover:text-rose-800 transition-colors"
                >
                  <ShieldCheck size={18} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
                <Link
                  href="/master-dashboard"
                  className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <Briefcase size={18} />
                  <span className="hidden sm:inline">Master</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <NotificationBell />
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
