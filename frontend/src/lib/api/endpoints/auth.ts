/**
 * Authentication API Endpoints
 */

import api from '../client';
import { User } from '../types';

export const authApi = {
  /**
   * Get current authenticated user
   */
  getCurrentUser: () => api.get<User>('/api/auth/me'),

  /**
   * Initiate Google OAuth (redirects to backend)
   */
  loginWithGoogle: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  },

  /**
   * Logout current user
   */
  logout: () => api.post<void>('/api/auth/logout'),
};
