import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/auth/hooks/useAuth';
import { useCartStore } from '../features/cart/store/cartStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutContent() {
  const { loading } = useAuth();
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="product/[id]" options={{ presentation: 'card', headerShown: true, title: 'Product Details' }} />
      <Stack.Screen name="checkout" options={{ presentation: 'card', headerShown: true, title: 'Checkout' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
