import React, { useMemo } from 'react';
import { FlatList, RefreshControl, View, Text, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react-native';
import { ordersApi, Order } from '@/features/orders/api/ordersApi';
import { OrderCard } from '@/components/order/OrderCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { spacing, borderRadius } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { useOrdersRealtime } from '../../features/orders/hooks/useOrdersRealtime';
import { useNetworkSync } from '../../features/orders/hooks/useNetworkSync';
import { useTheme } from '../../contexts/ThemeContext';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.background,
      } as ViewStyle,
      list: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
      } as ViewStyle,
      skeletonContainer: {
        padding: spacing.md,
      } as ViewStyle,
      skeletonCard: {
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
      } as ViewStyle,
    }),
    [c]
  );

  const { data: orders, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getMyOrders(),
  });

  // Subscribe to real-time order updates
  useOrdersRealtime(true);

  // Auto-refresh when app comes to foreground
  useNetworkSync();

  const renderSkeleton = () => (
    <View style={themedStyles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={themedStyles.skeletonCard}>
          <Skeleton height={140} />
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Orders" showBack={false} />
        {renderSkeleton()}
      </SafeAreaView>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View style={themedStyles.container}>
        <CustomHeader title="Orders" showBack={false} />
        <EmptyState icon={Package} title="No orders yet" description="Your order history will appear here" />
      </View>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
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
            onPress={() => router.push(`/(tabs)/orders/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={themedStyles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary[500]} colors={[c.primary[500]]} />
        }
      />
    </SafeAreaView>
  );
}
