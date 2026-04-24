import { supabase } from '../../config/supabase';
import { env } from '../../config/env';
import { RegisterInput, LoginInput, ForgotPasswordInput } from '../../schemas/auth.schema';
import { UnauthorizedError, ValidationError } from '../../utils/errors';

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
      redirectTo: env.RESET_PASSWORD_REDIRECT_URL,
    });

    if (error) {
      // Log error for monitoring but don't expose details to prevent user enumeration
      console.error('Password reset error for email:', email, error.message);
      // Optionally, you could throw a generic error for server errors (5xx)
      // But for user-not-found, we still return success to avoid leaking info
    }

    // Always return success to prevent email enumeration attacks
    return {
      message: 'If an account exists with this email, you will receive a password reset link shortly.',
    };
  }

  async resetPassword(data: { token: string; password: string }) {
    const { token, password } = data;

    // Verify the recovery token
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token,
      type: 'recovery',
    } as any); // Type cast for Supabase types

    if (verifyError || !verifyData.user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Update password using admin privileges
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      verifyData.user.id,
      { password }
    );

    if (updateError) {
      throw new ValidationError(updateError.message);
    }

    return { message: 'Password reset successfully' };
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
