import { create } from 'zustand';
import { authApi } from '../api/auth.api';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // initially true while checking auth
  
  setAuth: (user, accessToken) => set({ 
    user, 
    accessToken, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setAccessToken: (accessToken) => set({ accessToken }),
  
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    set({ 
      user: null, 
      accessToken: null, 
      isAuthenticated: false,
      isLoading: false
    });
  },
  
  setLoading: (isLoading) => set({ isLoading }),
}));
