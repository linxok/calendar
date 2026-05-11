'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
import { validationPresets } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
    validationRules: {
      name: validationPresets.name,
      email: validationPresets.email,
      phone: validationPresets.phone,
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      },
    },
    onSubmit: async (values) => {
      setServerError('');

      try {
        const res = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.token);
        router.push('/');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed';
        setServerError(errorMessage);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              value={form.values.name}
              onChange={(e) => form.handleChange('name', e.target.value)}
              onBlur={() => form.handleBlur('name')}
              error={form.touched.name ? form.errors.name : undefined}
            />
            <Input
              label="Email address"
              type="email"
              value={form.values.email}
              onChange={(e) => form.handleChange('email', e.target.value)}
              onBlur={() => form.handleBlur('email')}
              error={form.touched.email ? form.errors.email : undefined}
            />
            <Input
              label="Phone number"
              type="tel"
              value={form.values.phone}
              onChange={(e) => form.handleChange('phone', e.target.value)}
              onBlur={() => form.handleBlur('phone')}
              error={form.touched.phone ? form.errors.phone : undefined}
              placeholder="+1 (555) 123-4567"
            />
            <Input
              label="Password"
              type="password"
              value={form.values.password}
              onChange={(e) => form.handleChange('password', e.target.value)}
              onBlur={() => form.handleBlur('password')}
              error={form.touched.password ? form.errors.password : undefined}
              hint="At least 8 characters with uppercase, lowercase and number"
            />
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              isLoading={form.isSubmitting}
              disabled={!form.isValid && Object.keys(form.touched).length > 0}
            >
              Create account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
