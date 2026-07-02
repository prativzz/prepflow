import api from './axios';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  googleLogin: async (data) => {
    const response = await api.post('/auth/google', data);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  googleRegister: async (data) => {
    const response = await api.post('/auth/google-register', data);
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  
  updatePassword: async (data) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  }
};
