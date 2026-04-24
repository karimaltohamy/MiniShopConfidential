import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../features/products/api/productsApi';
import { useCartStore } from '../../features/cart/store/cartStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { colors, typography, spacing, borderRadius } from '../../theme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id!),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });

    Alert.alert('Success', `${product.name} added to cart`, [
      { text: 'Continue Shopping', onPress: () => router.back() },
      { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Skeleton height={300} style={{ marginBottom: spacing.lg }} />
          <Skeleton height={30} width="80%" style={{ marginBottom: spacing.sm }} />
          <Skeleton height={24} width="40%" style={{ marginBottom: spacing.md }} />
          <Skeleton height={60} style={{ marginBottom: spacing.md }} />
          <Skeleton height={50} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: product.image_url || 'https://via.placeholder.com/400' }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.details}>
          {product.categories && (
            <Badge style={styles.categoryBadge}>
              {product.categories.name}
            </Badge>
          )}

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          {product.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Button onPress={handleAddToCart} fullWidth size="lg">
              Add to Cart
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: spacing.xl,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.gray[100],
  },
  details: {
    padding: spacing.md,
  },
  categoryBadge: {
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
    marginBottom: spacing.lg,
  },
  descriptionContainer: {
    marginBottom: spacing.lg,
  },
  descriptionLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  footer: {
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
});
