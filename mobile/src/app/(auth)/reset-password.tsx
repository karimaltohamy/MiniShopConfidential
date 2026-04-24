import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { colors, typography, spacing } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/utils/validations';
import * as Linking from 'expo-linking';

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
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

  const { handleChange, handleBlur, handleSubmit: handleSubmitForm, values, errors, touched, isSubmitting } =
    formik;

  // Loading state while extracting token
  if (!token && !errorMsg) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Verifying Link" showBack subtitle="" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Verifying your reset link...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state if token missing or invalid
  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Invalid Link" showBack subtitle="" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Link Expired or Invalid</Text>
          <Text style={styles.errorMessage}>{errorMsg}</Text>
          <Button
            onPress={() => router.push('/(auth)/forgot-password')}
            fullWidth
            style={styles.button}
          >
            Request New Link
          </Button>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.backLink}>Back to Login</Text>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader
        title="Reset Password"
        showBack
        subtitle="Create a new password for your account"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            autoCapitalize="none"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            autoCapitalize="none"
          />

          <Button
            onPress={() => handleSubmitForm()}
            loading={isSubmitting || submitting}
            fullWidth
            style={styles.button}
          >
            Update Password
          </Button>

          <Link href="/(auth)/login" asChild>
            <Text style={styles.backLink}>Back to Login</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  lockIcon: {
    fontSize: 40,
  },
  form: {
    marginTop: spacing.lg,
  },
  button: {
    marginTop: spacing.lg,
  },
  backLink: {
    fontSize: typography.fontSize.base,
    color: colors.primary[500],
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
