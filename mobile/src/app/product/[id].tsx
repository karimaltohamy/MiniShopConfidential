import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, Alert, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Heart } from 'lucide-react-native';
import { productsApi } from '../../features/products/api/productsApi';
import { useCartStore } from '../../features/cart/store/cartStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { spacing, borderRadius, typography } from '../../theme';
import { CustomHeader } from '../../components/navigation/CustomHeader';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.surface,
      } as ViewStyle,
      content: {
        paddingBottom: spacing.xl,
      } as ViewStyle,
      imageContainer: {
        position: 'relative',
      } as ViewStyle,
      image: {
        width: '100%',
        height: 300,
        backgroundColor: c.gray[200],
      } as ImageStyle,
      details: {
        padding: spacing.md,
        backgroundColor: c.card,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: -spacing.lg,
      } as ViewStyle,
      categoryBadge: {
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
      } as ViewStyle,
      name: {
        fontSize: 24, // typography.fontSize['2xl']
        fontWeight: '700' as any,
        color: c.textPrimary,
        marginBottom: spacing.sm,
        lineHeight: 24 * 1.5,
      } as TextStyle,
      price: {
        fontSize: 30, // typography.fontSize['3xl']
        fontWeight: '700' as any,
        color: c.primary[500],
        marginBottom: spacing.lg,
      } as TextStyle,
      descriptionContainer: {
        marginBottom: spacing.lg,
      } as ViewStyle,
      descriptionLabel: {
        fontSize: 18, // typography.fontSize.lg
        fontWeight: '600' as any,
        color: c.textPrimary,
        marginBottom: spacing.sm,
      } as TextStyle,
      description: {
        fontSize: 16, // typography.fontSize.base
        color: c.textSecondary,
        lineHeight: 16 * 1.75,
      } as TextStyle,
      footer: {
        marginTop: spacing.md,
      } as ViewStyle,
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle,
      errorText: {
        fontSize: 18, // typography.fontSize.lg
        color: c.textSecondary,
      } as TextStyle,
    }),
    [c]
  );

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
      <SafeAreaView style={themedStyles.container}>
        <ScrollView contentContainerStyle={themedStyles.content}>
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
      <SafeAreaView style={themedStyles.container}>
        <View style={themedStyles.errorContainer}>
          <Text style={themedStyles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Product Details" showBack showMenu onMenuPress={() => {}} />
      <ScrollView contentContainerStyle={themedStyles.content}>
        <View style={themedStyles.imageContainer}>
          <Image
            source={{ uri: product.image_url || 'https://via.placeholder.com/400' }}
            style={themedStyles.image}
            resizeMode="cover"
          />
        </View>

        <View style={themedStyles.details}>
          {product.categories && (
            <Badge style={themedStyles.categoryBadge}>{product.categories.name}</Badge>
          )}

          <Text style={themedStyles.name}>{product.name}</Text>
          <Text style={themedStyles.price}>${product.price.toFixed(2)}</Text>

          {product.description && (
            <View style={themedStyles.descriptionContainer}>
              <Text style={themedStyles.descriptionLabel}>Description</Text>
              <Text style={themedStyles.description}>{product.description}</Text>
            </View>
          )}

          <View style={themedStyles.footer}>
            <Button onPress={handleAddToCart} fullWidth size="lg">
              Add to Cart
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
