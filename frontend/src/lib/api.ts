const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}/api${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; phone: string; password: string }) =>
      fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchApi('/auth/logout', { method: 'POST' }),
    me: () => fetchApi('/auth/me'),
    updateProfile: (data: Partial<{ name: string; email: string; phone: string }>) =>
      fetchApi('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
  },
  masters: {
    list: () => fetchApi('/masters'),
    get: (id: string) => fetchApi(`/masters/${id}`),
  },
  services: {
    list: () => fetchApi('/services'),
    get: (id: string) => fetchApi(`/services/${id}`),
  },
  availability: {
    getSlots: (params: { master_id: string; service_id: string; date: string }) => {
      const query = new URLSearchParams(params).toString();
      return fetchApi(`/availability?${query}`);
    },
  },
  appointments: {
    list: () => fetchApi('/appointments'),
    my: () => fetchApi('/my-appointments'),
    master: (params?: { date?: string; status?: string; from?: string; to?: string }) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return fetchApi(`/master/appointments${query ? `?${query}` : ''}`);
    },
    get: (id: string) => fetchApi(`/appointments/${id}`),
    create: (data: {
      master_id: string;
      service_id: string;
      client_name: string;
      client_phone: string;
      start_at: string;
      notes?: string;
    }) => fetchApi('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { status?: string; start_at?: string; notes?: string }) =>
      fetchApi(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    cancel: (id: string) => fetchApi(`/appointments/${id}`, { method: 'DELETE' }),
  },
  calendar: {
    daily: (date: string) => fetchApi(`/calendar/daily?date=${date}`),
    weekly: (startDate: string) => fetchApi(`/calendar/weekly?start_date=${startDate}`),
  },
};
