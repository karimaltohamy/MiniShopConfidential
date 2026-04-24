import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { CustomHeader } from '../../components/navigation/CustomHeader';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

   return (
     <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader
        title="Forgot Password"
        showBack
        subtitle="Enter your email to reset password"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={40} color={colors.primary[500]} />
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            error={error}
            autoCapitalize="none"
          />

          <Button
            onPress={handleResetPassword}
            loading={loading}
            fullWidth
            style={styles.button}
          >
            Send Reset Link
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
});
