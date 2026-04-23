import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AvailabilityResponse, Master, Service } from '@/types';

export function useMasters() {
  return useQuery({
    queryKey: ['masters'],
    queryFn: api.masters.list,
    staleTime: 1000 * 60 * 5,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: api.services.list,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAvailability(masterId: string, serviceId: string, date: string) {
  return useQuery<AvailabilityResponse>({
    queryKey: ['availability', masterId, serviceId, date],
    queryFn: () => api.availability.getSlots({ master_id: masterId, service_id: serviceId, date }),
    enabled: !!masterId && !!serviceId && !!date,
    staleTime: 1000 * 60,
  });
}

export function useAppointments() {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: api.appointments.list,
  });

  const createMutation = useMutation({
    mutationFn: api.appointments.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: api.appointments.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return {
    appointments: appointmentsQuery.data || [],
    isLoading: appointmentsQuery.isLoading,
    createAppointment: createMutation.mutate,
    cancelAppointment: cancelMutation.mutate,
  };
}
