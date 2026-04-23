import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, setUser, setToken, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data);
      queryClient.setQueryData(['user'], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: api.auth.register,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: api.auth.me,
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: user || userQuery.data,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
  };
}
