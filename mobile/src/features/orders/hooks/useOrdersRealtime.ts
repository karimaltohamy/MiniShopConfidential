import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { Order } from '../api/ordersApi';
import { useAuth } from '../../auth/hooks/useAuth';

interface OrderRealtimePayload {
  new: Order;
  old: Order;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}


export function useOrdersRealtime(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Don't subscribe if disabled or no user authenticated
    if (!enabled || !user) {
      return;
    }

    console.log('[Realtime] Subscribing to orders changes for user:', user.id);

    // Create channel for orders table with user-specific filter
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          console.log('[Realtime] Order update received:', {
            event: payload.eventType,
            orderId: payload.new?.id || payload.old?.id,
            status: payload.new?.status,
          });
          handleOrderChange(payload as OrderRealtimePayload);
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);

        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Successfully subscribed to orders realtime');
        }

        if (status === 'CHANNEL_ERROR') {
          console.error('[Realtime] Channel error occurred');
          // Channel will auto-reconnect, but we can optionally trigger a refetch
        }

        if (status === 'TIMED_OUT') {
          console.error('[Realtime] Connection timed out');
          // Trigger refetch to ensure data consistency
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      });

    channelRef.current = channel;

    // Cleanup on unmount or when dependencies change
    return () => {
      console.log('[Realtime] Unsubscribing from orders realtime');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, user?.id, queryClient]);

  /**
   * Handles incoming realtime events and updates TanStack Query cache
   */
  const handleOrderChange = (payload: OrderRealtimePayload) => {
    const { eventType, new: newOrder, old: oldOrder } = payload;

    // Update TanStack Query cache optimistically
    queryClient.setQueryData<Order[]>(['orders'], (oldData) => {
      if (!oldData) {
        // If cache is empty, don't try to update
        // A refetch will happen naturally when the query is used
        return oldData;
      }

      switch (eventType) {
        case 'INSERT':
          // Add new order to the beginning (newest first)
          console.log('[Realtime] Adding new order to cache:', newOrder.id);
          return [newOrder, ...oldData];

        case 'UPDATE':
          // Update existing order in place
          // Merge with existing data to preserve order_items and other nested relations
          console.log('[Realtime] Updating order in cache:', newOrder.id, {
            oldStatus: oldData.find(o => o.id === newOrder.id)?.status,
            newStatus: newOrder.status,
          });
          return oldData.map((order) =>
            order.id === newOrder.id
              ? { ...order, ...newOrder } // Merge: keep order_items, update status/updated_at
              : order
          );

        case 'DELETE':
          // Remove deleted order from cache
          console.log('[Realtime] Removing order from cache:', oldOrder.id);
          return oldData.filter((order) => order.id !== oldOrder.id);

        default:
          return oldData;
      }
    });
  };
}
