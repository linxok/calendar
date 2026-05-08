'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface Master {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  is_active?: boolean;
}

interface MasterForm {
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

const emptyForm: MasterForm = { name: '', email: '', phone: '', specialization: '' };

export default function AdminMastersPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MasterForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    setIsLoading(true);
    try {
      const data = await api.masters.list();
      setMasters(data);
    } catch {
      setError('Failed to load masters');
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

  const openEdit = (master: Master) => {
    setForm({
      name: master.name,
      email: master.email,
      phone: master.phone || '',
      specialization: master.specialization || '',
    });
    setEditingId(master.id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      if (editingId) {
        await api.admin.masters.update(editingId, form);
        setMasters((prev) =>
          prev.map((m) => (m.id === editingId ? { ...m, ...form } : m))
        );
      } else {
        const created = await api.admin.masters.create(form);
        setMasters((prev) => [...prev, created]);
      }
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete master "${name}"?`)) return;
    try {
      await api.admin.masters.delete(id);
      setMasters((prev) => prev.filter((m) => m.id !== id));
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
            <h1 className="text-2xl font-bold text-gray-900">Masters</h1>
            <p className="text-gray-600 text-sm">Manage your salon masters</p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} className="mr-2" />
            Add Master
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : masters.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No masters yet. Add your first master.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Email</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Phone</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-600">Specialization</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {masters.map((master) => (
                    <tr key={master.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{master.name}</td>
                      <td className="px-6 py-4 text-gray-600">{master.email}</td>
                      <td className="px-6 py-4 text-gray-600">{master.phone || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">{master.specialization || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(master)}>
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(master.id, master.name)}
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
                <CardTitle>{editingId ? 'Edit Master' : 'Add Master'}</CardTitle>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="Specialization"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
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
                  {editingId ? 'Save Changes' : 'Create Master'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
