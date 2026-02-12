import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { User } from '@/types';
import { AxiosError } from 'axios';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await authApi.getCurrentUser();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: () => {
      toast.error('Logout failed');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: () => logoutMutation.mutate(),
    loginWithGoogle: authApi.loginWithGoogle,
    isLoggingOut: logoutMutation.isPending,
  };
}
