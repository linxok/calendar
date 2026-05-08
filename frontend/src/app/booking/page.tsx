'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useForm } from '@/hooks/useForm';
import { validationPresets } from '@/lib/validation';
import { api } from '@/lib/api';

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
  const [serverError, setServerError] = useState('');

  const form = useForm({
    initialValues: {
      serviceId: '',
      masterId: '',
      date: '',
      timeSlot: '',
      clientName: '',
      clientPhone: '',
    },
    validationRules: {
      clientName: validationPresets.name,
      clientPhone: validationPresets.phone,
      date: validationPresets.date,
    },
  });

  useEffect(() => {
    api.services.list().then(setServices).catch(console.error);
    api.masters.list().then(setMasters).catch(console.error);
  }, []);

  useEffect(() => {
    if (form.values.masterId && form.values.serviceId && form.values.date) {
      api.availability
        .getSlots({
          master_id: form.values.masterId as string,
          service_id: form.values.serviceId as string,
          date: form.values.date as string,
        })
        .then((data) => setSlots(data.slots || []))
        .catch(console.error);
    }
  }, [form.values.masterId, form.values.serviceId, form.values.date]);

  const handleSubmit = async () => {
    setServerError('');

    try {
      await api.appointments.create({
        master_id: form.values.masterId as string,
        service_id: form.values.serviceId as string,
        client_name: form.values.clientName as string,
        client_phone: form.values.clientPhone as string,
        start_at: `${form.values.date} ${form.values.timeSlot}`,
      });

      router.push('/booking/success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Booking failed';
      setServerError(errorMessage);
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
                      onClick={() => form.setFieldValue('serviceId', service.id)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        form.values.serviceId === service.id
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
                  disabled={!form.values.serviceId}
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
                  value={form.values.masterId}
                  onChange={(e) => form.setFieldValue('masterId', e.target.value)}
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
                  value={form.values.date}
                  onChange={(e) => form.setFieldValue('date', e.target.value)}
                  onBlur={() => form.handleBlur('date')}
                  error={form.touched.date ? form.errors.date : undefined}
                  min={new Date().toISOString().split('T')[0]}
                />

                {slots.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.filter(s => s.available).map((slot) => (
                      <button
                        key={slot.start_time}
                        onClick={() => form.setFieldValue('timeSlot', slot.start_time)}
                        className={`p-2 border rounded text-sm ${
                          form.values.timeSlot === slot.start_time
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
                    disabled={!form.values.masterId || !form.values.date || !form.values.timeSlot}
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
                  value={form.values.clientName}
                  onChange={(e) => form.handleChange('clientName', e.target.value)}
                  onBlur={() => form.handleBlur('clientName')}
                  error={form.touched.clientName ? form.errors.clientName : undefined}
                  required
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={form.values.clientPhone}
                  onChange={(e) => form.handleChange('clientPhone', e.target.value)}
                  onBlur={() => form.handleBlur('clientPhone')}
                  error={form.touched.clientPhone ? form.errors.clientPhone : undefined}
                  required
                />

                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <p className="text-sm text-red-600">{serverError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    isLoading={form.isSubmitting}
                    disabled={!form.values.clientName || !form.values.clientPhone || !form.isValid}
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
