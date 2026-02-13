import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { User } from '@/types';
import { SignUpData, SignInData } from '@/lib/validations/auth';
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

  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      toast.success(
        'Account created! Please check your email for verification code.'
      );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message || 'Failed to create account';
      toast.error(message);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authApi.verifyEmail(email, otp),
    onSuccess: user => {
      queryClient.setQueryData(['user'], user);
      toast.success('Email verified successfully! Welcome to CareerLab!');
      router.push('/dashboard');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Failed to verify email';
      toast.error(message);
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: authApi.resendOTP,
    onSuccess: () => {
      toast.success('New verification code sent to your email!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Failed to resend code';
      toast.error(message);
    },
  });

  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: user => {
      queryClient.setQueryData(['user'], user);
      toast.success('Welcome back!');
      router.push('/dashboard');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || 'Failed to sign in';
      toast.error(message);
    },
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
    signUp: (data: SignUpData) => signUpMutation.mutate(data),
    verifyEmail: (email: string, otp: string) =>
      verifyEmailMutation.mutate({ email, otp }),
    resendOTP: (email: string) => resendOTPMutation.mutate(email),
    signIn: (data: SignInData) => signInMutation.mutate(data),
    logout: () => logoutMutation.mutate(),
    loginWithGoogle: authApi.loginWithGoogle,
    loginWithGitHub: authApi.loginWithGitHub,
    isSigningUp: signUpMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
    isResendingOTP: resendOTPMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
