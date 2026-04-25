import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ordersApi, Order } from '@/features/orders/api/ordersApi';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { spacing, borderRadius, typography } from '@/theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { useTheme } from '@/contexts/ThemeContext';

const statusVariants = {
  pending: 'warning' as const,
  processing: 'info' as const,
  shipped: 'info' as const,
  delivered: 'success' as const,
  cancelled: 'error' as const,
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.background,
      } as ViewStyle,
      content: {
        paddingBottom: spacing.xl,
      } as ViewStyle,
      headerSection: {
        padding: spacing.md,
        backgroundColor: c.card,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
      } as ViewStyle,
      orderIdRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
      } as ViewStyle,
      orderIdText: {
        fontSize: 22,
        fontWeight: '700',
        color: c.textPrimary,
      } as TextStyle,
      dateTimeText: {
        fontSize: 14,
        color: c.textSecondary,
        marginTop: 2,
      } as TextStyle,
      statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
      } as ViewStyle,
      itemsSection: {
        padding: spacing.md,
        backgroundColor: c.card,
        marginTop: spacing.md,
      } as ViewStyle,
      sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: c.textPrimary,
        marginBottom: spacing.md,
      } as TextStyle,
      itemCard: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: c.background,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
      } as ViewStyle,
      itemImage: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.md,
        backgroundColor: c.gray[200],
      } as ImageStyle,
      itemDetails: {
        flex: 1,
        marginLeft: spacing.md,
      } as ViewStyle,
      itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: c.textPrimary,
        marginBottom: spacing.xs,
      } as TextStyle,
      itemMeta: {
        fontSize: 14,
        color: c.textSecondary,
      } as TextStyle,
      itemTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: c.primary[600],
      } as TextStyle,
      divider: {
        height: 1,
        backgroundColor: c.border,
        marginVertical: spacing.md,
      } as ViewStyle,
      summarySection: {
        padding: spacing.md,
        backgroundColor: c.card,
        marginTop: spacing.md,
      } as ViewStyle,
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
      } as ViewStyle,
      summaryLabel: {
        fontSize: 16,
        color: c.textSecondary,
      } as TextStyle,
      summaryValue: {
        fontSize: 16,
        color: c.textPrimary,
        fontWeight: '500',
      } as TextStyle,
      totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: c.border,
      } as ViewStyle,
      totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: c.textPrimary,
      } as TextStyle,
      totalValue: {
        fontSize: 22,
        fontWeight: '700',
        color: c.primary[600],
      } as TextStyle,
      emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle,
      emptyText: {
        fontSize: 18,
        color: c.textSecondary,
        marginTop: spacing.md,
      } as TextStyle,
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle,
      errorText: {
        fontSize: 18,
        color: c.error[500],
      } as TextStyle,
    }),
    [c]
  );

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Order Details" showBack />
        <ScrollView contentContainerStyle={themedStyles.content}>
          <View style={themedStyles.headerSection}>
            <Skeleton height={22} width="60%" style={{ marginBottom: spacing.sm }} />
            <Skeleton height={16} width="40%" />
          </View>
          <View style={themedStyles.itemsSection}>
            <Skeleton height={18} width="30%" style={{ marginBottom: spacing.md }} />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={80} style={{ marginBottom: spacing.sm }} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Order Details" showBack />
        <View style={themedStyles.errorContainer}>
          <Text style={themedStyles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedTotal = new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(order.total_amount);

  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Order Details" showBack />
      <ScrollView contentContainerStyle={themedStyles.content}>
        {/* Header Section */}
        <View style={themedStyles.headerSection}>
          <View style={themedStyles.orderIdRow}>
            <Text style={themedStyles.orderIdText}>Order #{order.id.slice(0, 8)}</Text>
          </View>
          <Text style={themedStyles.dateTimeText}>
            {formattedDate} at {formattedTime}
          </Text>
          <View style={themedStyles.statusRow}>
            <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
          </View>
        </View>

        {/* Items Section */}
        <View style={themedStyles.itemsSection}>
          <Text style={themedStyles.sectionTitle}>Order Items ({totalItems})</Text>
          {order.order_items.map((item) => {
            const itemTotal = item.unit_price * item.quantity;
            const formattedItemTotal = new Intl.NumberFormat('en-EG', {
              style: 'currency',
              currency: 'EGP',
            }).format(itemTotal);

            return (
              <View key={item.id} style={themedStyles.itemCard}>
                <Image
                  source={{
                    uri:
                      item.products.image_url ||
                      'https://via.placeholder.com/60/9CA3AF/FFFFFF?text=No+Image',
                  }}
                  style={themedStyles.itemImage}
                  resizeMode="cover"
                />
                <View style={themedStyles.itemDetails}>
                  <Text style={themedStyles.itemName} numberOfLines={2}>
                    {item.products.name}
                  </Text>
                  <Text style={themedStyles.itemMeta}>
                    Qty: {item.quantity} × {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(item.unit_price)}
                  </Text>
                </View>
                <Text style={themedStyles.itemTotal}>{formattedItemTotal}</Text>
              </View>
            );
          })}
        </View>

        {/* Summary Section */}
        <View style={themedStyles.summarySection}>
          <Text style={themedStyles.sectionTitle}>Order Summary</Text>
          <View style={themedStyles.divider} />
          <View style={themedStyles.summaryRow}>
            <Text style={themedStyles.summaryLabel}>Subtotal</Text>
            <Text style={themedStyles.summaryValue}>{formattedTotal}</Text>
          </View>
          <View style={themedStyles.summaryRow}>
            <Text style={themedStyles.summaryLabel}>Shipping</Text>
            <Text style={themedStyles.summaryValue}>Free</Text>
          </View>
          <View style={themedStyles.totalRow}>
            <Text style={themedStyles.totalLabel}>Total</Text>
            <Text style={themedStyles.totalValue}>{formattedTotal}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
