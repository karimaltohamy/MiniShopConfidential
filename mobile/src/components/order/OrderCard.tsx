import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius, typography } from '../../theme';

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

export function OrderCard({
  id,
  status,
  total_amount,
  created_at,
  items,
  onPress,
}: OrderCardProps) {
  const { theme } = useTheme();
  const c = theme.colors;

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

  const getStatusDotColor = () => {
    switch (status) {
      case 'pending':
        return c.warning[500];
      case 'processing':
        return c.info[500];
      case 'shipped':
        return c.info[600];
      case 'delivered':
        return c.success[500];
      case 'cancelled':
        return c.error[500];
      default:
        return c.gray[500];
    }
  };

  const cardStyle: ViewStyle = {
    marginBottom: spacing.md,
    backgroundColor: c.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderColor: c.border,
    borderWidth: 1,
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  };

  const headerLeftStyle: ViewStyle = {
    flex: 1,
    marginRight: spacing.sm,
  };

  const orderIdRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const statusDotStyle: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    backgroundColor: getStatusDotColor(),
  };

  const orderIdStyle: TextStyle = {
    fontSize: 20, // typography.fontSize.xl
    fontWeight: '700' as any,
    color: c.textPrimary,
  };

  const dateTimeStyle: TextStyle = {
    fontSize: 12, // typography.fontSize.xs
    color: c.textSecondary,
    marginTop: 4,
  };

  const badgeStyle = {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  };

  const itemsContainerStyle: ViewStyle = {
    marginBottom: spacing.md,
  };

  const itemsRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  };

  const itemImageWrapperStyle: ViewStyle = {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: c.card,
    marginLeft: -10,
    overflow: 'hidden',
    backgroundColor: c.gray[200],
  };

  const moreBadgeStyle: ViewStyle = {
    backgroundColor: c.gray[700],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  };

  const moreTextStyle: TextStyle = {
    color: '#fff',
    fontSize: 12, // typography.fontSize.xs
    fontWeight: '600',
  };

  const itemNameStyle: TextStyle = {
    fontSize: 14, // typography.fontSize.sm
    color: c.gray[700],
  };

  const itemCountTextStyle: TextStyle = {
    fontSize: 12, // typography.fontSize.xs
    color: c.textSecondary,
    marginTop: 2,
  };

  const dividerStyle: ViewStyle = {
    height: 1,
    backgroundColor: c.border,
    marginVertical: spacing.md,
    opacity: 0.6,
  };

  const footerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const totalLabelStyle: TextStyle = {
    fontSize: 12, // typography.fontSize.xs
    color: c.textSecondary,
  };

  const totalAmountStyle: TextStyle = {
    fontSize: 20,
    fontWeight: '700',
    color: c.primary[600],
  };

  const chevronWrapperStyle: ViewStyle = {
    backgroundColor: c.surfaceVariant,
    padding: 8,
    borderRadius: borderRadius.full,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        cardStyle,
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {/* Header */}
      <View style={headerStyle}>
        <View style={headerLeftStyle}>
          <View style={orderIdRowStyle}>
            <View style={statusDotStyle} />
            <Text style={orderIdStyle}>Order #{id.slice(0, 8)}</Text>
          </View>

          <Text style={dateTimeStyle}>
            {formattedDate} • {formattedTime}
          </Text>
        </View>

        <Badge variant={statusVariants[status]} style={badgeStyle}>
          {statusLabels[status]}
        </Badge>
      </View>

      {/* Items Preview */}
      <View style={itemsContainerStyle}>
        <View style={itemsRowStyle}>
          {items.slice(0, 3).map((item, index) => (
            <View
              key={index}
              style={[
                itemImageWrapperStyle,
                index === 0 && { marginLeft: 0 },
              ]}
            >
              <Image
                source={{
                  uri:
                    item.products.image_url ||
                    'https://via.placeholder.com/60/9CA3AF/FFFFFF?text=No+Image',
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          ))}

          {items.length > 3 && (
            <View style={moreBadgeStyle}>
              <Text style={moreTextStyle}>+{items.length - 3}</Text>
            </View>
          )}
        </View>

        {items.length > 0 && (
          <Text style={itemNameStyle} numberOfLines={1}>
            {items[0].products.name}
          </Text>
        )}

        <Text style={itemCountTextStyle}>
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Divider */}
      <View style={dividerStyle} />

      {/* Footer */}
      <View style={footerStyle}>
        <View>
          <Text style={totalLabelStyle}>Total</Text>
          <Text style={totalAmountStyle}>{formattedPrice}</Text>
        </View>

        <View style={chevronWrapperStyle}>
          <ChevronRight size={20} color={c.gray[500]} />
        </View>
      </View>
    </Pressable>
  );
}
