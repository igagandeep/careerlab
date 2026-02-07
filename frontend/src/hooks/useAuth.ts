/**
 * Authentication Hook
 * Manages user authentication state with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/endpoints';
import { User } from '@/lib/api/types';

export const AUTH_QUERY_KEY = ['auth', 'user'];

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authApi.getCurrentUser();
      } catch (error: any) {
        // If 401, user is not authenticated
        if (error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear(); // Clear all cached data
      toast.success('Logged out successfully');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Logout failed');
    },
  });

  return {
    // State
    user,
    isLoading,
    isAuthenticated: !!user,
    error,

    // Actions
    logout: logoutMutation.mutate,
    loginWithGoogle: authApi.loginWithGoogle,

    // Mutation states
    isLoggingOut: logoutMutation.isPending,
  };
}
