import { supabase } from '../../config/supabase';
import { env } from '../../config/env';
import { RegisterInput, LoginInput, ForgotPasswordInput } from '../../schemas/auth.schema';
import { UnauthorizedError, ValidationError } from '../../utils/errors';

export class AuthService {
  async register(data: RegisterInput) {
    const { name, email, password } = data;

    // Create auth user with admin API to bypass email confirmation
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { name },
    });

    if (authError) {
      // Handle specific Supabase error cases
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        throw new ValidationError('An account with this email already exists');
      }
      if (authError.message.includes('invalid') || authError.message.includes('Invalid')) {
        throw new ValidationError(authError.message);
      }
      throw new ValidationError(authError.message);
    }

    if (!authData.user) {
      throw new ValidationError('Failed to create user');
    }

    // Sign in the user to get session tokens
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      throw new ValidationError('Account created but failed to sign in. Please try logging in.');
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // Return user data and session tokens for auto-login
    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || name,
        role: profile?.role,
      },
      session: {
        access_token: signInData.session?.access_token,
        refresh_token: signInData.session?.refresh_token,
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
