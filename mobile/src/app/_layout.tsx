import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/auth/hooks/useAuth';
import { useCartStore } from '../features/cart/store/cartStore';
import { ThemeProvider } from '../contexts/ThemeContext';
import { initializeDeepLinking } from '../lib/deepLinking';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutContent() {
  const { user, loading } = useAuth();
  const loadCart = useCartStore((state) => state.loadCart);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  // Initialize deep linking for Supabase auth flows
  useEffect(() => {
    console.log('Initializing deep link handler...');
    const cleanup = initializeDeepLinking();
    return cleanup;
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect unauthenticated users to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect authenticated users to home
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(auth)/reset-password" />
      <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
