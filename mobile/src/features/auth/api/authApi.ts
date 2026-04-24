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

export const authApi = {
  async register(data: RegisterData) {
    const { name, email, password } = data;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError) throw authError;

    return authData;
  },

  async login(data: LoginData) {
    const { data: authData, error } = await supabase.auth.signInWithPassword(data);

    if (error) throw error;

    return authData;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },

  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'myapp://reset-password',
    });

    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) return null;

    // Get profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      ...user,
      profile,
    };
  },
};
