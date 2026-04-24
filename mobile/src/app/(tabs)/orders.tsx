import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react-native';
import { ordersApi, Order } from '../../features/orders/api/ordersApi';
import { OrderCard } from '../../components/order/OrderCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { colors, spacing } from '../../theme';
import { View } from 'react-native';

export default function OrdersScreen() {
  const { data: orders, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getMyOrders(),
  });

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <Skeleton height={120} />
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {renderSkeleton()}
      </SafeAreaView>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
  },
  skeletonContainer: {
    padding: spacing.md,
  },
  skeletonCard: {
    marginBottom: spacing.md,
  },
});
