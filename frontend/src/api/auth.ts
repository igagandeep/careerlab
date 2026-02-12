import { api } from './client';
import { User } from '@/types';
import { SignUpData, SignInData } from '@/lib/validations/auth';

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  signUp: async (data: SignUpData): Promise<User> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<User> => {
    const response = await api.post('/api/auth/signin', data);
    return response.data;
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
