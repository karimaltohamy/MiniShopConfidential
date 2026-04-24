import { apiClient } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { LoginCredentials, User } from '@/types';

export const authApi = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<{ user: User; session: { access_token: string; refresh_token: string } }>('/auth/login', credentials);
    return response.data;
  },

  async register(registerData: { name: string; email: string; password: string }) {
    const response = await apiClient.post('/auth/register', registerData);
    return response.data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return null;

    // Fetch user profile via backend API
    const profileResponse = await apiClient.get<{ role: string }>('/auth/me');

    if (!profileResponse.data || profileResponse.data.role !== 'admin') {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      role: profileResponse.data.role,
      created_at: session.user.created_at,
    };
  },
};
