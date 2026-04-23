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
    <div className=min-h-screen