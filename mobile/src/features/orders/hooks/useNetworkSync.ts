import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for syncing data when app comes to foreground
 *
 * This hook helps maintain data consistency by refetching orders when:
 * - User returns to the app after backgrounding
 * - App regains focus after being inactive
 *
 * This ensures that if the realtime connection was lost while the app
 * was in the background, we'll refresh the data when the user returns.
 *
 * @example
 * ```tsx
 * function OrdersScreen() {
 *   useNetworkSync(); // Auto-refetch when app comes to foreground
 *   // ...rest of component
 * }
 * ```
 */
export function useNetworkSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground, refetch orders to ensure data is fresh
        console.log('[NetworkSync] App became active, invalidating orders query');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [queryClient]);
}
