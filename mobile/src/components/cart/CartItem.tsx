import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  image_url,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Image
          source={{ uri: image_url || 'https://via.placeholder.com/80' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          <View style={styles.controls}>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={onDecrement}
              >
                <Minus size={16} color={colors.primary[500]} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={onIncrement}
              >
                <Plus size={16} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
                <Trash2 size={18} color={colors.error[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.subtotal}>
          Subtotal: ${(price * quantity).toFixed(2)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: 0,
  },
  content: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
    marginBottom: spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: spacing.md,
  },
  subtotal: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
  },
});
