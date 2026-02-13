import { api } from './client';
import { User } from '@/types';
import { SignUpData, SignInData } from '@/lib/validations/auth';

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    throw new Error('getCurrentUser endpoint not implemented');
  },

  signUp: async (
    data: SignUpData
  ): Promise<{ message: string; otpSent: boolean }> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  verifyEmail: async (email: string, otp: string): Promise<User> => {
    const response = await api.post('/api/auth/verify-email', { email, otp });
    return response.data.data.user;
  },

  resendOTP: async (
    email: string
  ): Promise<{ message: string; otpSent: boolean }> => {
    const response = await api.post('/api/auth/resend-otp', { email });
    return response.data;
  },

  signIn: async (data: SignInData): Promise<User> => {
    const response = await api.post('/api/auth/login', data);
    return response.data.data.user;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  loginWithGoogle: () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/auth/google`;
  },

  loginWithGitHub: () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/auth/github`;
  },
};
