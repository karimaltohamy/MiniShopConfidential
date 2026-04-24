import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ShoppingCart, Heart } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

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
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>

      {/* IMAGE SECTION */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: image_url || 'https://via.placeholder.com/300',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* PRICE BADGE */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>
            ${price.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {/* PRICE (secondary small view for hierarchy) */}
        <Text style={styles.subPrice}>
          ${price.toFixed(2)}
        </Text>

        {/* ACTION BUTTON */}
        <Button
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          size="sm"
          fullWidth
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <ShoppingCart size={16} color="#fff" />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </View>
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },

  imageContainer: {
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray[100],
  },

  /* ❤️ Favorite Button */
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },

  /* 💰 Price Badge (top overlay) */
  priceBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },

  priceBadgeText: {
    color: '#fff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  content: {
    padding: spacing.md,
  },

  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    minHeight: 40,
  },

  subPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },

  button: {
    marginTop: spacing.xs,
    borderRadius: borderRadius.md,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});