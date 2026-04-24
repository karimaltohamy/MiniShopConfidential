import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { ShoppingCart, Heart } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  onPress: () => void;
  onAddToCart: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ProductCard({
  name,
  price,
  image_url,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const cardStyle: ViewStyle = {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: themeColors.border
  };

  const imageContainerStyle: ViewStyle = {
    position: 'relative',
  };

  const imageStyle = {
    width: '100%' as const,
    height: 160,
    backgroundColor: themeColors.gray[200],
  };

  const priceBadgeStyle: ViewStyle = {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: themeColors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  };

  const priceBadgeTextStyle: TextStyle = {
    color: '#fff',
    fontSize: 12, // typography.fontSize.xs
    fontWeight: 'bold' as any,
  };

  const contentStyle: ViewStyle = {
    padding: spacing.md,
  };

  const nameStyle: TextStyle = {
    fontSize: 16, // typography.fontSize.base
    fontWeight: '600' as any,
    color: themeColors.textPrimary,
    marginBottom: 4, // spacing.xs
    minHeight: 40,
  };

  const subPriceStyle: TextStyle = {
    fontSize: 14, // typography.fontSize.sm
    color: themeColors.gray[500],
    marginBottom: spacing.sm,
  };

  const buttonStyle = {
    marginTop: spacing.xs,
  };

  const buttonContentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  };

  const buttonTextStyle: TextStyle = {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  };

  return (
    <Card onPress={onPress} style={cardStyle}>
      {/* IMAGE SECTION */}
      <View style={imageContainerStyle}>
        <Image
          source={{
            uri: image_url || 'https://via.placeholder.com/300',
          }}
          style={imageStyle}
          resizeMode="cover"
        />

        {/* PRICE BADGE */}
        <View style={priceBadgeStyle}>
          <Text style={priceBadgeTextStyle}>${price.toFixed(2)}</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={contentStyle}>
        <Text style={nameStyle} numberOfLines={2}>
          {name}
        </Text>

        {/* PRICE (secondary small view for hierarchy) */}
        <Text style={subPriceStyle}>${price.toFixed(2)}</Text>

        {/* ACTION BUTTON */}
        <Button
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          size="sm"
          fullWidth
          style={buttonStyle}
        >
          <View style={buttonContentStyle}>
            <ShoppingCart size={16} color="#fff" />
            <Text style={buttonTextStyle}>Add to Cart</Text>
          </View>
        </Button>
      </View>
    </Card>
  );
}
