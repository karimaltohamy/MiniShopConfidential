import React, { useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControl, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Package, Calendar, Filter } from 'lucide-react-native';
import { ordersApi, Order } from '@/features/orders/api/ordersApi';
import { OrderCard } from '@/components/order/OrderCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { colors, typography, spacing, borderRadius, shadows, gradients } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { useOrdersRealtime } from '../../features/orders/hooks/useOrdersRealtime';
import { useNetworkSync } from '../../features/orders/hooks/useNetworkSync';

export default function OrdersScreen() {
  const { data: orders, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getMyOrders(),
  });

  // Subscribe to real-time order updates
  useOrdersRealtime(true);

  // Auto-refresh when app comes to foreground
  useNetworkSync();


  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <Skeleton height={140} />
        </View>
      ))}
    </View>
  );



  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Orders" showBack={false} />
        {renderSkeleton()}
      </SafeAreaView>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Orders" showBack={false} />
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Orders" showBack={false} />
      <FlatList
        data={orders}
        renderItem={({ item }: { item: Order }) => (
          <OrderCard
            id={item.id}
            status={item.status}
            total_amount={item.total_amount}
            created_at={item.created_at}
            items={item.order_items}
            onPress={() => {
              // Navigate to order detail if implemented
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  listHeader: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: 0,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  skeletonContainer: {
    padding: spacing.md,
  },
  statSkeleton: {
    flex: 1,
    minWidth: '47%',
    marginBottom: spacing.md,
  },
  statSkeletonCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  skeletonCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
});
