'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';

interface Service {
  id: string;
  name: string;
  duration_min: number;
  price?: number;
}

interface Master {
  id: string;
  name: string;
  specialization?: string;
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, mastersRes] = await Promise.all([
          fetch('http://localhost:8000/api/services'),
          fetch('http://localhost:8000/api/masters'),
        ]);
        
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (mastersRes.ok) setMasters(await mastersRes.json());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Beauty Appointment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our professional services and experienced masters. 
            Schedule your visit in just a few clicks.
          </p>
          <div className="mt-6">
            <Link href="/booking">
              <Button size="lg">Book Now</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <ul className="space-y-3">
                  {services.slice(0, 6).map((service) => (
                    <li key={service.id} className="flex justify-between items-center">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-gray-500">
                        {service.duration_min} min
                        {service.price && ` - $${service.price}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Masters</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <ul className="space-y-3">
                  {masters.slice(0, 5).map((master) => (
                    <li key={master.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {master.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{master.name}</p>
                        {master.specialization && (
                          <p className="text-sm text-gray-500">{master.specialization}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
