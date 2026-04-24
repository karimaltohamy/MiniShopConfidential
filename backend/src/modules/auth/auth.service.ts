import { supabase } from '../../config/supabase';
import { RegisterInput, LoginInput, ForgotPasswordInput } from '../../schemas/auth.schema';
import { UnauthorizedError } from '../../utils/errors';

export class AuthService {
  async register(data: RegisterInput) {
    const { name, email, password } = data;

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    // Profile is auto-created via database trigger
    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
      },
    };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name,
        role: profile?.role,
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
      },
    };
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const { email } = data;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'myapp://reset-password',
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Password reset email sent',
    };
  }

  async getMe(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      throw new Error('Profile not found');
    }

    return profile;
  }
}
