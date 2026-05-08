'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Notification, NotificationStats } from '@/types/notification';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { Mail, MessageSquare, Smartphone, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'email' | 'telegram' | 'sms'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [notificationsRes, statsRes] = await Promise.all([
        api.notifications.list(),
        api.notifications.stats(),
      ]);
      setNotifications(notificationsRes.data);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
    await Promise.all(unreadIds.map((id) => api.notifications.markAsRead(id)));
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
  };

  const filteredNotifications = notifications.filter((n) =>
    activeFilter === 'all' ? true : n.channel === activeFilter
  );

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={18} className="text-blue-500" />;
      case 'telegram':
        return <MessageSquare size={18} className="text-cyan-500" />;
      case 'sms':
        return <Smartphone size={18} className="text-green-500" />;
      default:
        return <Mail size={18} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      booking_confirmation: 'Booking Confirmed',
      reminder: 'Reminder',
      cancellation: 'Cancelled',
      reschedule: 'Rescheduled',
    };
    return labels[type] || type;
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">View your notification history and settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.channel}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getChannelIcon(stat.channel)}
                    <span className="font-medium capitalize">{stat.channel}</span>
                  </div>
                  <span className="text-2xl font-bold">{stat.total}</span>
                </div>
                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-500" />
                    {stat.delivered} delivered
                  </span>
                  {stat.failed > 0 && (
                    <span className="flex items-center gap-1">
                      <XCircle size={14} className="text-red-500" />
                      {stat.failed} failed
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {(['all', 'email', 'telegram', 'sms'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      activeFilter === filter
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read_at ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getChannelIcon(notification.channel)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getTypeLabel(notification.type)}</span>
                            <span className="text-gray-400">|</span>
                            {getStatusIcon(notification.status)}
                            <span className="text-sm text-gray-500 capitalize">{notification.status}</span>
                          </div>
                          {notification.subject && (
                            <p className="text-sm font-medium mt-1">{notification.subject}</p>
                          )}
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>To: {notification.recipient}</span>
                            <span>•</span>
                            <span>
                              {format(parseISO(notification.sent_at), 'MMM d, yyyy HH:mm')}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(parseISO(notification.sent_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          {notification.error_message && (
                            <p className="text-xs text-red-500 mt-2">
                              Error: {notification.error_message}
                            </p>
                          )}
                        </div>
                      </div>
                      {!notification.read_at && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
