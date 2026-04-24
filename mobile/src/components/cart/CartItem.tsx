import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius, typography } from '../../theme';

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
  const { theme } = useTheme();
  const c = theme.colors;

  const cardStyle: ViewStyle = {
    marginBottom: spacing.md,
    padding: 0,
    borderWidth: 1,
    borderColor: c.border
  };

  const contentStyle: ViewStyle = {
    flexDirection: 'row',
    padding: spacing.md,
  };

  const imageStyle = {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: c.gray[200],
  };

  const detailsStyle: ViewStyle = {
    flex: 1,
    marginLeft: spacing.md,
  };

  const nameStyle: TextStyle = {
    fontSize: 16, // typography.fontSize.base
    fontWeight: '500' as any,
    color: c.textPrimary,
    marginBottom: 4, // spacing.xs
  };

  const priceStyle: TextStyle = {
    fontSize: 18, // typography.fontSize.lg
    fontWeight: '700' as any,
    color: c.primary[500],
    marginBottom: spacing.sm,
  };

  const controlsStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const quantityControlStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.gray[200],
    borderRadius: borderRadius.md,
    padding: 4,
  };

  const quantityButtonStyle: ViewStyle = {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const quantityStyle: TextStyle = {
    fontSize: 16, // typography.fontSize.base
    fontWeight: '600' as any,
    color: c.textPrimary,
    marginHorizontal: spacing.md,
    minWidth: 24,
    textAlign: 'center',
  };

  const removeButtonStyle: ViewStyle = {
    padding: spacing.sm,
  };

  const footerStyle: ViewStyle = {
    borderTopWidth: 1,
    borderTopColor: c.border,
    padding: spacing.md,
  };

  const subtotalStyle: TextStyle = {
    fontSize: 16, // typography.fontSize.base
    fontWeight: '600' as any,
    color: c.textPrimary,
    textAlign: 'right',
  };

  return (
    <Card style={cardStyle}>
      <View style={contentStyle}>
        <Image
          source={{ uri: image_url || 'https://via.placeholder.com/80' }}
          style={imageStyle}
          resizeMode="cover"
        />
        <View style={detailsStyle}>
          <Text style={nameStyle} numberOfLines={2}>
            {name}
          </Text>
          <Text style={priceStyle}>${price.toFixed(2)}</Text>
          <View style={controlsStyle}>
            <View style={quantityControlStyle}>
              <TouchableOpacity style={quantityButtonStyle} onPress={onDecrement}>
                <Minus size={16} color={c.primary[500]} />
              </TouchableOpacity>
              <Text style={quantityStyle}>{quantity}</Text>
              <TouchableOpacity style={quantityButtonStyle} onPress={onIncrement}>
                <Plus size={16} color={c.primary[500]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={removeButtonStyle} onPress={onRemove}>
              <Trash2 size={18} color={c.error[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={footerStyle}>
        <Text style={subtotalStyle}>Subtotal: ${(price * quantity).toFixed(2)}</Text>
      </View>
    </Card>
  );
}
