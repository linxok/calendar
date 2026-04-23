'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Service {
  id: string;
  name: string;
  duration_min: number;
  price?: number;
}

interface Master {
  id: string;
  name: string;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    serviceId: '',
    masterId: '',
    date: '',
    timeSlot: '',
    clientName: '',
    clientPhone: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/services')
      .then(r => r.json())
      .then(setServices);
    fetch('http://localhost:8000/api/masters')
      .then(r => r.json())
      .then(setMasters);
  }, []);

  useEffect(() => {
    if (formData.masterId && formData.serviceId && formData.date) {
      fetch(`http://localhost:8000/api/availability?master_id=${formData.masterId}&service_id=${formData.serviceId}&date=${formData.date}`)
        .then(r => r.json())
        .then(data => setSlots(data.slots || []));
    }
  }, [formData.masterId, formData.serviceId, formData.date]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          master_id: formData.masterId,
          service_id: formData.serviceId,
          client_name: formData.clientName,
          client_phone: formData.clientPhone,
          start_at: `${formData.date} ${formData.timeSlot}`,
        }),
      });
      
      if (!res.ok) throw new Error('Booking failed');
      
      router.push('/booking/success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=min-h-screen