import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface OrderCardProps {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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

const statusDotColors = {
  pending: colors.warning[500],
  processing: colors.info[500],
  shipped: colors.info[600],
  delivered: colors.success[500],
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

  const formattedPrice = new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(total_amount);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.orderIdRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusDotColors[status] },
              ]}
            />
            <Text style={styles.orderId}>Order #{id.slice(0, 8)}</Text>
          </View>

          <Text style={styles.dateTime}>
            {formattedDate} • {formattedTime}
          </Text>
        </View>

        <Badge variant={statusVariants[status]} style={styles.badge}>
          {statusLabels[status]}
        </Badge>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsContainer}>
        <View style={styles.itemsRow}>
          {items.slice(0, 3).map((item, index) => (
            <View
              key={index}
              style={[
                styles.itemImageWrapper,
                index === 0 && { marginLeft: 0 },
              ]}
            >
              <Image
                source={{
                  uri:
                    item.products.image_url ||
                    'https://via.placeholder.com/60/9CA3AF/FFFFFF?text=No+Image',
                }}
                style={styles.itemImage}
              />
            </View>
          ))}

          {items.length > 3 && (
            <View style={styles.moreBadge}>
              <Text style={styles.moreText}>
                +{items.length - 3}
              </Text>
            </View>
          )}
        </View>

        {items.length > 0 && (
          <Text style={styles.itemName} numberOfLines={1}>
            {items[0].products.name}
          </Text>
        )}

        <Text style={styles.itemCountText}>
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formattedPrice}</Text>
        </View>

        <View style={styles.chevronWrapper}>
          <ChevronRight size={20} color={colors.gray[500]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
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
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },

  dateTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    marginTop: 4,
  },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },

  itemsContainer: {
    marginBottom: spacing.md,
  },

  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  itemImageWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -10,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
  },

  itemImage: {
    width: '100%',
    height: '100%',
  },

  moreBadge: {
    backgroundColor: colors.gray[700],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },

  moreText: {
    color: '#fff',
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },

  itemName: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  itemCountText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: spacing.md,
    opacity: 0.6,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
  },

  chevronWrapper: {
    backgroundColor: colors.gray[50],
    padding: 8,
    borderRadius: borderRadius.full,
  },
});