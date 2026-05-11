'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
import { validationPresets } from '@/lib/validation';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: validationPresets.email,
      password: {
        required: true,
        minLength: 6,
      },
    },
    onSubmit: async (values) => {
      setServerError('');

      try {
        const res = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Invalid credentials');
        }

        const data = await res.json();
        localStorage.setItem('token', data.token);
        router.push('/');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setServerError(errorMessage);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={form.values.email}
              onChange={(e) => form.handleChange('email', e.target.value)}
              onBlur={() => form.handleBlur('email')}
              error={form.touched.email ? form.errors.email : undefined}
            />
            <Input
              label="Password"
              type="password"
              value={form.values.password}
              onChange={(e) => form.handleChange('password', e.target.value)}
              onBlur={() => form.handleBlur('password')}
              error={form.touched.password ? form.errors.password : undefined}
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
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
