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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment - Step {step} of 3</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-medium">Select Service</h3>
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setFormData({ ...formData, serviceId: service.id })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formData.serviceId === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {service.duration_min} min{service.price ? ` - $${service.price}` : ''}
                      </p>
                    </button>
                  ))}
                </div>
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!formData.serviceId}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-medium">Select Master & Date</h3>
                
                <select
                  value={formData.masterId}
                  onChange={(e) => setFormData({ ...formData, masterId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose a master</option>
                  {masters.map((master) => (
                    <option key={master.id} value={master.id}>{master.name}</option>
                  ))}
                </select>

                <Input
                  type="date"
                  label="Select Date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />

                {slots.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.filter(s => s.available).map((slot) => (
                      <button
                        key={slot.start_time}
                        onClick={() => setFormData({ ...formData, timeSlot: slot.start_time })}
                        className={`p-2 border rounded text-sm ${
                          formData.timeSlot === slot.start_time
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {slot.start_time}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={!formData.masterId || !formData.date || !formData.timeSlot}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium">Your Details</h3>
                
                <Input
                  label="Full Name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  required
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    disabled={!formData.clientName || !formData.clientPhone}
                    className="flex-1"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
