import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface OrderCardProps {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  items: {
    quantity: number;
    products: {
      name: string;
      image_url?: string;
    };
  }[];
  onPress: () => void;
}

const statusVariants = {
  pending: 'warning' as const,
  processing: 'info' as const,
  completed: 'success' as const,
  cancelled: 'error' as const,
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function OrderCard({
  id,
  status,
  total_amount,
  created_at,
  items,
  onPress,
}: OrderCardProps) {
  const date = new Date(created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{id.slice(0, 8)}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <Badge variant={statusVariants[status]}>
          {statusLabels[status]}
        </Badge>
      </View>

      <View style={styles.items}>
        {items.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.item}>
            <Image
              source={{
                uri: item.products.image_url || 'https://via.placeholder.com/40',
              }}
              style={styles.itemImage}
            />
            <Text style={styles.itemName} numberOfLines={1}>
              {item.products.name} x{item.quantity}
            </Text>
          </View>
        ))}
        {items.length > 3 && (
          <Text style={styles.moreItems}>+{items.length - 3} more items</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${total_amount.toFixed(2)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  items: {
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  itemName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  moreItems: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
});
