import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { spacing, typography, borderRadius } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { LoginFormValues, loginSchema } from '@/utils/validations';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoginScreen() {
  const { login } = useAuth();
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
      forgotPassword: {
        fontSize: 14, // typography.fontSize.sm
        color: c.primary[500],
        textAlign: 'right' as const,
        marginBottom: spacing.lg,
      } as TextStyle,
      loginButton: {
        marginTop: spacing.md,
      } as ViewStyle,
      demoButton: {
        marginTop: spacing.sm,
        paddingVertical: spacing.sm,
        alignItems: 'center',
      } as ViewStyle,
      demoButtonText: {
        fontSize: 16, // typography.fontSize.base
        color: c.primary[500],
        fontWeight: '500' as any,
      } as TextStyle,
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

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: handleSubmit,
  });

  const { handleChange, handleBlur, handleSubmit: handleSubmitForm, values, errors, touched } = formik;

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Welcome Back" showBack={false} subtitle="Sign in to continue shopping" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={themedStyles.keyboardView}>
        <ScrollView contentContainerStyle={themedStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={themedStyles.logoContainer}>
            <View style={themedStyles.logoCircle}>
              <ShoppingBag size={48} color={c.primary[500]} />
            </View>
            <Text style={themedStyles.appName}>MiniShop</Text>
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

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Text style={themedStyles.forgotPassword}>Forgot Password?</Text>
            </Link>

            <Button onPress={() => handleSubmitForm()} loading={formik.isSubmitting} fullWidth style={themedStyles.loginButton}>
              Sign In
            </Button>

            <TouchableOpacity style={themedStyles.demoButton} onPress={() => {
              formik.setFieldValue('email', 'customer@test.com');
              formik.setFieldValue('password', 'Test1234!');

            }}>
              <Text style={themedStyles.demoButtonText}>Try Demo Account</Text>
            </TouchableOpacity>

            <View style={themedStyles.footer}>
              <Text style={themedStyles.footerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <Text style={themedStyles.link}>Sign Up</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
