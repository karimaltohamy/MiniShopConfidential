import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { spacing, typography } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/utils/validations';
import { supabase } from '@/lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.surface,
      } as ViewStyle,
      content: {
        flexGrow: 1,
        padding: spacing.lg,
      } as ViewStyle,
      form: {
        flex: 1,
      } as ViewStyle,
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle,
      loadingText: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.base,
        color: c.textSecondary,
      } as TextStyle,
      errorText: {
        fontSize: typography.fontSize.base,
        color: c.error[500],
        textAlign: 'center',
        marginTop: spacing.md,
      } as TextStyle,
      button: {
        marginTop: spacing.lg,
      } as ViewStyle,
    }),
    [c]
  );

  const [isVerifying, setIsVerifying] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialValues: ResetPasswordFormValues = {
    password: '',
    confirmPassword: '',
  };

  // Verify that the user has a valid session (restored by deep link handler)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          setErrorMsg('Invalid or expired reset link. Please request a new one.');
          setIsVerifying(false);
          return;
        }

        // Session is valid, user can proceed to reset password
        console.log('Session verified for password reset');
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying session:', error);
        setErrorMsg('Failed to verify reset link. Please try again.');
        setIsVerifying(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setSubmitting(true);
    try {
      // Update password using Supabase's updateUser method
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Success',
        'Password updated successfully! Please sign in with your new password.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Sign out and redirect to login
              await supabase.auth.signOut();
              router.replace('/(auth)/login');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: handleSubmit,
  });

  const { handleChange, handleBlur, handleSubmit: handleSubmitForm, values, errors, touched } = formik;

  // Loading state while verifying session
  if (isVerifying) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Verifying Link" showBack subtitle="" />
        <View style={themedStyles.loadingContainer}>
          <ActivityIndicator size="large" color={c.primary[500]} />
          <Text style={themedStyles.loadingText}>Verifying your reset link...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state if session is invalid or expired
  if (errorMsg) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Error" showBack />
        <View style={themedStyles.loadingContainer}>
          <Text style={themedStyles.errorText}>{errorMsg}</Text>
          <Button
            onPress={() => router.replace('/(auth)/forgot-password')}
            style={{ marginTop: spacing.lg }}
          >
            Request New Reset Link
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Reset Password" showBack subtitle="Enter your new password" />
      <ScrollView contentContainerStyle={themedStyles.content}>
        <View style={themedStyles.form}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password ? errors.password : undefined}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
          />

          <Button onPress={() => handleSubmitForm()} loading={submitting} fullWidth style={themedStyles.button}>
            Reset Password
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
