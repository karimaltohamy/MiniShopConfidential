import { apiClient } from '../../../lib/api/client';
import { supabase } from '../../../lib/supabase';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export const authApi = {
  async register(data: RegisterData) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: ResetPasswordData) {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
