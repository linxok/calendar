 'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Calendar, Home, Plus } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl mb-3">Booking Confirmed!</CardTitle>
            <p className="text-gray-600 mb-2">
              Your appointment has been successfully scheduled.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You will receive a confirmation notification via email, SMS, or Telegram.
            </p>

            <div className="space-y-3">
              <Link href="/calendar" className="block">
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/booking" className="block">
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Book Again
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need to reschedule?{' '}
            <Link href="/calendar" className="text-blue-600 hover:underline">
              View your appointments
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
