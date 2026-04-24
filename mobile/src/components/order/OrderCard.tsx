import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

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
  onPress?: () => void;
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

const statusDotColors = {
  pending: colors.warning[500],
  processing: colors.info[500],
  completed: colors.success[500],
  cancelled: colors.error[500],
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

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Header with Order ID, Status, and Date */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.orderIdRow}>
            <View style={[styles.statusDot, { backgroundColor: statusDotColors[status] }]} />
            <Text style={styles.orderId}>Order #{id.slice(0, 8)}</Text>
          </View>
          <Text style={styles.dateTime}>{formattedDate} at {formattedTime}</Text>
        </View>
        <Badge variant={statusVariants[status]} style={styles.badge}>
          {statusLabels[status]}
        </Badge>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsContainer}>
        <View style={styles.itemsRow}>
          {items.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.itemPreview}>
              <View style={[styles.itemImageWrapper, shadows.xs]}>
                <Image
                  source={{
                    uri: item.products.image_url || 'https://via.placeholder.com/60/9CA3AF/FFFFFF?text=No+Image',
                  }}
                  style={styles.itemImage}
                  defaultSource={{ uri: 'https://via.placeholder.com/60/9CA3AF/FFFFFF?text=No+Image' }}
                />
              </View>
            </View>
          ))}
          {items.length === 0 && (
            <View style={styles.noItemsPlaceholder}>
              <Text style={styles.noItemsText}>No items</Text>
            </View>
          )}
        </View>
        {items.length > 3 && (
          <Text style={styles.moreItemsText}>
            + {items.length - 3} more item{items.length - 3 > 1 ? 's' : ''}
          </Text>
        )}
        <Text style={styles.itemCountText}>
          {totalItems} item{totalItems !== 1 ? 's' : ''} total
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer with Total and Chevron */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>${total_amount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.chevronWrapper}
          onPress={onPress}
          disabled={!onPress}
        >
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  orderId: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  dateTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  itemsContainer: {
    marginBottom: spacing.md,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemPreview: {},
  itemImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  noItemsPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  noItemsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  moreItemsText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  itemCountText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    marginTop: 2,
  },
  chevronWrapper: {
    padding: spacing.xs,
    margin: -spacing.xs,
  },
});
