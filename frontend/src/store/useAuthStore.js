import { create } from 'zustand';

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
  
  logout: () => set({ 
    user: null, 
    accessToken: null, 
    isAuthenticated: false,
    isLoading: false
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));
