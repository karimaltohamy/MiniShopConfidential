import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { colors, typography, spacing, borderRadius } from '../../theme';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  onPress: () => void;
  onAddToCart: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  image_url,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Image
        source={{
          uri: image_url || 'https://via.placeholder.com/200',
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        <Button
          onPress={(e) => {
            onAddToCart();
          }}
          size="sm"
          fullWidth
          style={styles.button}
        >
          Add to Cart
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
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: colors.gray[100],
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    minHeight: 40,
  },
  price: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.xs,
  },
});
