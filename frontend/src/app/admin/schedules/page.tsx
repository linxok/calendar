'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Plus, Trash2, X, Check, ChevronDown } from 'lucide-react';

interface Master {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface NewSchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const defaultNewSchedule: NewSchedule = { day_of_week: 1, start_time: '09:00', end_time: '18:00' };

export default function AdminSchedulesPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingMasters, setIsLoadingMasters] = useState(true);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState<NewSchedule>(defaultNewSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.masters.list()
      .then((data) => {
        setMasters(data);
        if (data.length > 0) setSelectedMasterId(data[0].id);
      })
      .catch(() => setError('Failed to load masters'))
      .finally(() => setIsLoadingMasters(false));
  }, []);

  useEffect(() => {
    if (!selectedMasterId) return;
    setIsLoadingSchedules(true);
    api.admin.schedules
      .list(selectedMasterId)
      .then(setSchedules)
      .catch(() => setSchedules([]))
      .finally(() => setIsLoadingSchedules(false));
  }, [selectedMasterId]);

  const handleAddSchedule = async () => {
    if (!newSchedule.start_time || !newSchedule.end_time) {
      setError('Start and end time are required');
      return;
    }
    if (newSchedule.start_time >= newSchedule.end_time) {
      setError('Start time must be before end time');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      const created = await api.admin.schedules.create(selectedMasterId, newSchedule);
      setSchedules((prev) => [...prev, created]);
      setShowModal(false);
      setNewSchedule(defaultNewSchedule);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Remove this schedule slot?')) return;
    try {
      await api.admin.schedules.delete(selectedMasterId, scheduleId);
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const selectedMaster = masters.find((m) => m.id === selectedMasterId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Working Schedules</h1>
          <p className="text-gray-600 text-sm">Configure weekly schedules for each master</p>
        </div>

        {/* Master selector */}
        <Card className="mb-6">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Master:</label>
              <div className="relative flex-1 max-w-xs">
                <select
                  value={selectedMasterId}
                  onChange={(e) => setSelectedMasterId(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={isLoadingMasters}
                >
                  {masters.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule grid */}
        {selectedMasterId && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedMaster?.name}&apos;s Schedule
                </CardTitle>
                <Button size="sm" onClick={() => { setError(''); setShowModal(true); }}>
                  <Plus size={16} className="mr-2" />
                  Add Slot
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingSchedules ? (
                <div className="text-center py-8 text-gray-500">Loading schedules...</div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No schedule configured. Add working hours to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {[...schedules]
                    .sort((a, b) => a.day_of_week - b.day_of_week)
                    .map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-6">
                          <span className="font-medium w-28 text-gray-800">
                            {DAYS[schedule.day_of_week - 1] ?? `Day ${schedule.day_of_week}`}
                          </span>
                          <span className="text-sm text-gray-600">
                            {schedule.start_time} — {schedule.end_time}
                          </span>
                          {schedule.is_active === false && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(schedule.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Working Hours</CardTitle>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select
                  value={newSchedule.day_of_week}
                  onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DAYS.map((day, i) => (
                    <option key={day} value={i + 1}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSchedule.start_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSchedule.end_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddSchedule} isLoading={isSaving}>
                  <Check size={16} className="mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
