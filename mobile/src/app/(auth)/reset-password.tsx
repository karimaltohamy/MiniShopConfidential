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
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { spacing, typography, borderRadius } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/utils/validations';
import * as Linking from 'expo-linking';
import { useTheme } from '../../contexts/ThemeContext';

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
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

  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialValues: ResetPasswordFormValues = {
    password: '',
    confirmPassword: '',
  };

  // Extract token from deep link URL on mount
  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      const extractedToken = (queryParams?.token ?? queryParams?.access_token) as string | null;
      if (extractedToken) {
        setToken(extractedToken);
        setErrorMsg(null);
      } else {
        setErrorMsg('Invalid reset link: missing token');
      }
    };

    // Check initial URL (app cold start)
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleUrl({ url: initialUrl });
      }
    })();

    // Listen for URLs when app is warm started
    const subscription = Linking.addEventListener('url', handleUrl);

    return () => subscription.remove();
  }, []);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      Alert.alert('Error', 'Reset token is missing. Please request a new reset link.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, password: values.password });
      Alert.alert('Success', 'Password updated successfully! Please sign in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error: any) {
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

  // Loading state while extracting token
  if (!token && !errorMsg) {
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

  // Error state if token missing or invalid
  if (errorMsg) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Error" showBack />
        <View style={themedStyles.loadingContainer}>
          <Text style={themedStyles.errorText}>{errorMsg}</Text>
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
