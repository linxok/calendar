'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { api } from '@/lib/api';
import { Notification } from '@/types/notification';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.notifications.unreadCount();
      setUnreadCount(response.count);
    } catch {
      // Silently fail - user might not be logged in
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.notifications.list();
      setNotifications(response.data.slice(0, 5)); // Show last 5
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  };

  const getIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return '📧';
      case 'telegram':
        return '✈️';
      case 'sms':
        return '📱';
      default:
        return '🔔';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
        return 'Booking Confirmed';
      case 'reminder':
        return 'Reminder';
      case 'cancellation':
        return 'Cancelled';
      case 'reschedule':
        return 'Rescheduled';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 transition-colors ${
                    !notification.read_at ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getIcon(notification.channel)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{getTypeLabel(notification.type)}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {notification.content.substring(0, 50)}...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(parseISO(notification.sent_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read_at && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t">
            <Link
              href="/notifications"
              className="block text-center text-sm text-blue-600 hover:text-blue-800 py-1"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
