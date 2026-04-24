import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus } from 'lucide-react-native';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { spacing, typography, borderRadius } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { registerSchema, RegisterFormValues } from '@/utils/validations';
import { useTheme } from '../../contexts/ThemeContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.surface,
      } as ViewStyle,
      keyboardView: {
        flex: 1,
      } as ViewStyle,
      scrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
      } as ViewStyle,
      logoContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
      } as ViewStyle,
      logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: c.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        borderWidth: 3,
        borderColor: c.primary[200],
      } as ViewStyle,
      appName: {
        fontSize: 24, // typography.fontSize['2xl']
        fontWeight: '700' as any,
        color: c.primary[600],
        letterSpacing: 1,
      } as TextStyle,
      form: {
        flex: 1,
      } as ViewStyle,
      registerButton: {
        marginTop: spacing.lg,
      } as ViewStyle,
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
        paddingBottom: spacing.lg,
      } as ViewStyle,
      footerText: {
        fontSize: 16, // typography.fontSize.base
        color: c.textSecondary,
      } as TextStyle,
      link: {
        fontSize: 16, // typography.fontSize.base
        color: c.primary[500],
        fontWeight: '600' as any,
      } as TextStyle,
    }),
    [c]
  );

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values);
      Alert.alert('Success', 'Account created! Please sign in.', [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]);
    } catch (error: any) {
      console.log({ error: error });

      let title = 'Registration Failed';
      let message = error.message || 'Please try again';

      const isRateLimitError = error?.status === 429 || error?.message === 'email rate limit exceeded';
      if (isRateLimitError) {
        title = 'Too Many Attempts';
        message = 'Too many registration attempts. Please wait a moment and try again.';
      }

      Alert.alert(title, message);
    }
  };

  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: handleSubmit,
  });

  const { handleChange, handleBlur, handleSubmit: handleSubmitForm, values, errors, touched, isSubmitting } = formik;

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Create Account" showBack subtitle="Sign up to start shopping" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={themedStyles.keyboardView}>
        <ScrollView contentContainerStyle={themedStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={themedStyles.logoContainer}>
            <View style={themedStyles.logoCircle}>
              <UserPlus size={48} color={c.primary[500]} />
            </View>
            <Text style={themedStyles.appName}>MiniShop</Text>
          </View>

          <View style={themedStyles.form}>
            <Input label="Name" placeholder="Enter your name" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} error={touched.name ? errors.name : undefined} />

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

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
            />

            <Button onPress={() => handleSubmitForm()} loading={isSubmitting} fullWidth style={themedStyles.registerButton}>
              Sign Up
            </Button>

            <View style={themedStyles.footer}>
              <Text style={themedStyles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <Text style={themedStyles.link}>Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
