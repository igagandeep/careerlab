import { api } from './client';
import { User } from '@/types';

export const authApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  loginWithGoogle: () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/auth/google`;
  },
};
