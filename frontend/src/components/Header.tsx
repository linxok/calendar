'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/NotificationBell';
import { Calendar, Scissors, Sparkles, LayoutDashboard, Briefcase, ShieldCheck, User } from 'lucide-react';

export function Header() {
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--gradient-accent)] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[var(--gray-900)]">
              Glow Studio
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/booking"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--gray-600)] hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-all"
            >
              <Scissors className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Запис</span>
            </Link>

            <Link
              href="/calendar"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--gray-600)] hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Календар</span>
            </Link>

            <Link
              href="/ai-assistant"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--violet-600)] hover:text-[var(--violet-700)] hover:bg-[var(--violet-50)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">AI</span>
            </Link>

            <div className="h-6 w-px bg-[var(--gray-200)] mx-2 hidden sm:block" />

            {isAuthenticated ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--rose-600)] hover:text-[var(--rose-700)] hover:bg-[var(--rose-50)] transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm font-medium">Адмін</span>
                </Link>
                <Link
                  href="/master-dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--amber-600)] hover:text-[var(--amber-700)] hover:bg-[var(--amber-50)] transition-all"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm font-medium">Майстер</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)] transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline text-sm font-medium">Кабінет</span>
                </Link>
                <div className="hidden sm:block">
                  <NotificationBell />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="ml-2 text-[var(--gray-500)] hover:text-[var(--gray-700)] hover:bg-[var(--gray-100)]"
                >
                  <User className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Вийти</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)]"
                  >
                    Увійти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="btn-primary text-sm px-4"
                  >
                    Реєстрація
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
