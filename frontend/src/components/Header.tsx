'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

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
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
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
