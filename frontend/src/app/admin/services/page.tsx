'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration_min: number;
  price?: number;
  description?: string;
  is_active?: boolean;
}

interface ServiceForm {
  name: string;
  duration_min: string;
  price: string;
}

const emptyForm: ServiceForm = { name: '', duration_min: '30', price: '' };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await api.services.list();
      setServices(data);
    } catch {
      setError('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setForm({
      name: service.name,
      duration_min: String(service.duration_min),
      price: service.price != null ? String(service.price) : '',
    });
    setEditingId(service.id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.duration_min) {
      setError('Name and duration are required');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        duration_min: parseInt(form.duration_min),
        price: form.price ? parseFloat(form.price) : undefined,
      };
      if (editingId) {
        await api.admin.services.update(editingId, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s))
        );
      } else {
        const created = await api.admin.services.create(payload);
        setServices((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete service "${name}"?`)) return;
    try {
      await api.admin.services.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 text-sm">Manage your salon services</p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} className="mr-2" />
            Add Service
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No services yet. Add your first service.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Duration</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Price</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Description</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{service.name}</td>
                      <td className="px-6 py-4 text-gray-600">{service.duration_min} min</td>
                      <td className="px-6 py-4 text-gray-600">
                        {service.price != null ? `$${service.price}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {service.description || '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(service)}>
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(service.id, service.name)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingId ? 'Edit Service' : 'Add Service'}</CardTitle>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Service Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={form.duration_min}
                onChange={(e) => setForm({ ...form, duration_min: e.target.value })}
                required
              />
              <Input
                label="Price ($)"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave} isLoading={isSaving}>
                  <Check size={16} className="mr-2" />
                  {editingId ? 'Save Changes' : 'Create Service'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
