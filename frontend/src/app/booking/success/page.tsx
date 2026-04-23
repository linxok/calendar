 'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="mb-2">Booking Confirmed!</CardTitle>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully scheduled. You will receive a confirmation shortly.
            </p>
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full">Return to Home</Button>
              </Link>
              <Link href="/booking" className="block">
                <Button variant="outline" className="w-full">Book Another</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
