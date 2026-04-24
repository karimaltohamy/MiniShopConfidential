import React, { useMemo } from 'react';
import { View, Text, ScrollView, Alert, ViewStyle, TextStyle } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { spacing, typography, borderRadius } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/utils/validations';
import { useTheme } from '../../contexts/ThemeContext';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
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
      iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: c.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: spacing.lg,
      } as ViewStyle,
      form: {
        flex: 1,
      } as ViewStyle,
      button: {
        marginTop: spacing.md,
      } as ViewStyle,
      backLink: {
        fontSize: typography.fontSize.base,
        color: c.primary[500],
        textAlign: 'center',
        marginTop: spacing.lg,
      } as TextStyle,
    }),
    [c]
  );

  const initialValues: ForgotPasswordFormValues = {
    email: '',
  };

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values.email);
      Alert.alert('Success', 'Password reset link has been sent to your email.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset link');
    }
  };

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: handleSubmit,
  });

  const { handleChange, handleBlur, handleSubmit: handleSubmitForm, values, errors, touched, isSubmitting } = formik;

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Forgot Password" showBack subtitle="Enter your email to reset password" />
      <ScrollView contentContainerStyle={themedStyles.content}>
        <View style={themedStyles.iconContainer}>
          <Mail size={40} color={c.primary[500]} />
        </View>

        <View style={themedStyles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email ? errors.email : undefined}
            autoCapitalize="none"
          />

          <Button onPress={() => handleSubmitForm()} loading={isSubmitting} fullWidth style={themedStyles.button}>
            Send Reset Link
          </Button>

          <Link href="/(auth)/login" asChild>
            <Text style={themedStyles.backLink}>Back to Login</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
