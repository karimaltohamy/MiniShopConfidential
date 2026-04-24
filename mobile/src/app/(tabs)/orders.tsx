import React, { useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControl, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Package, Calendar, Filter } from 'lucide-react-native';
import { ordersApi, Order } from '../../features/orders/api/ordersApi';
import { OrderCard } from '../../components/order/OrderCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { colors, typography, spacing, borderRadius, shadows, gradients } from '../../theme';
import { CustomHeader } from '../../components/navigation/CustomHeader';
import { Badge } from '../../components/ui/Badge';

export default function OrdersScreen() {
  const { data: orders, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getMyOrders(),
  });

  const orderStats = useMemo(() => {
    if (!orders) return { total: 0, completed: 0, pending: 0, processing: 0, cancelled: 0 };
    return {
      total: orders.length,
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [orders]);

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.statsRow}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.statSkeleton}>
            <Skeleton height={64} style={styles.statSkeletonCard} />
          </View>
        ))}
      </View>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <Skeleton height={140} />
        </View>
      ))}
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: (colors.primary as any)[50] }]}>
        <View style={[styles.statIconWrapper, { backgroundColor: (colors.primary as any)[100] }]}>
          <Package size={24} color={colors.primary[600]} />
        </View>
        <Text style={styles.statValue}>{orderStats.total}</Text>
        <Text style={styles.statLabel}>Total Orders</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: (colors.success as any)[50] }]}>
        <View style={[styles.statIconWrapper, { backgroundColor: (colors.success as any)[100] }]}>
          <Package size={24} color={colors.success[600]} />
        </View>
        <Text style={[styles.statValue, { color: colors.success[700] }]}>{orderStats.completed}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: (colors.warning as any)[50] }]}>
        <View style={[styles.statIconWrapper, { backgroundColor: (colors.warning as any)[100] }]}>
          <Calendar size={24} color={colors.warning[600]} />
        </View>
        <Text style={[styles.statValue, { color: colors.warning[700] }]}>{orderStats.pending + orderStats.processing}</Text>
        <Text style={styles.statLabel}>In Progress</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: colors.gray[50] }]}>
        <View style={[styles.statIconWrapper, { backgroundColor: colors.gray[200] }]}>
          <Filter size={24} color={colors.gray[500]} />
        </View>
        <Text style={[styles.statValue, { color: colors.gray[700] }]}>{orderStats.cancelled}</Text>
        <Text style={styles.statLabel}>Cancelled</Text>
      </View>
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
         ListHeaderComponent={renderStatsCard}
         ListHeaderComponentStyle={styles.listHeader}
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
