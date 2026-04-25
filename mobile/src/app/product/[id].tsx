import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Heart, Star, Minus, Plus, Package, Calendar, CheckCircle, XCircle } from 'lucide-react-native';
import { productsApi } from '../../features/products/api/productsApi';
import { useCartStore } from '../../features/cart/store/cartStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { spacing, borderRadius, typography, shadows } from '../../theme';
import { CustomHeader } from '../../components/navigation/CustomHeader';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { theme } = useTheme();
  const c = theme.colors;

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.gray[100],
      } as ViewStyle,
      content: {
      } as ViewStyle,
      imageContainer: {
        position: 'relative',
        backgroundColor: c.card,
      } as ViewStyle,
      image: {
        width: '100%',
        height: 320,
        backgroundColor: c.card,
      } as ImageStyle,
      favoriteButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: c.card,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
        borderWidth: 1,
        borderColor: c.border,
      } as ViewStyle,
      details: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: 100,
        backgroundColor: c.card,
        borderTopLeftRadius: borderRadius['3xl'],
        borderTopRightRadius: borderRadius['3xl'],
        marginTop: -spacing.lg,
      } as ViewStyle,
      headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
      } as ViewStyle,
      categoryBadge: {
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
      } as ViewStyle,
      name: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: c.textPrimary,
        marginBottom: spacing.sm,
        lineHeight: typography.fontSize['3xl'] * typography.lineHeight.normal,
        letterSpacing: -0.5,
      } as TextStyle,
      priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
        gap: spacing.md,
      } as ViewStyle,
      price: {
        fontSize: 36,
        fontWeight: typography.fontWeight.bold,
        color: c.primary[600],
        letterSpacing: -1,
      } as TextStyle,
      ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: c.primary[50],
        borderRadius: borderRadius.full,
      } as ViewStyle,
      ratingText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: c.primary[600],
      } as TextStyle,
      section: {
        marginBottom: spacing.lg,
      } as ViewStyle,
      sectionLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: c.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.sm,
      } as TextStyle,
      description: {
        fontSize: typography.fontSize.base,
        color: c.textSecondary,
        lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
      } as TextStyle,
      metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: c.border,
        marginTop: spacing.md,
      } as ViewStyle,
      metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
      } as ViewStyle,
      metaIcon: {
        color: c.textSecondary,
        size: 16,
      } as any,
      metaText: {
        fontSize: typography.fontSize.xs,
        color: c.textSecondary,
      } as TextStyle,
      stockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      } as ViewStyle,
      quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: c.border,
      } as ViewStyle,
      quantityLabel: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: c.textPrimary,
      } as TextStyle,
      quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: c.surfaceVariant,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: c.border,
      } as ViewStyle,
      quantityButton: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: c.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: c.border,
      } as ViewStyle,
      quantityValue: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: c.textPrimary,
        minWidth: 32,
        textAlign: 'center',
      } as TextStyle,
      footer: {
        marginTop: spacing.lg,
      } as ViewStyle,
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      } as ViewStyle,
      errorText: {
        fontSize: typography.fontSize.lg,
        color: c.textSecondary,
        textAlign: 'center',
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

    // Add the item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }

    Alert.alert(
      'Success',
      `${quantity} × ${product.name} added to cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') },
      ],
      { cancelable: true }
    );
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getStockStatus = (): { label: string; variant: 'success' | 'warning' | 'error' | 'default'; icon: React.ReactNode } => {
    if (!product) return { label: 'Unknown', variant: 'default', icon: null };
    if (product.stock === 0 || !product.is_active) {
      return {
        label: 'Out of Stock',
        variant: 'error',
        icon: <XCircle size={12} color={c.error[500]} />,
      };
    }
    if (product.stock <= 5) {
      return {
        label: `Only ${product.stock} left!`,
        variant: 'warning',
        icon: <Package size={12} color={c.warning[500]} />,
      };
    }
    return {
      label: 'In Stock',
      variant: 'success',
      icon: <CheckCircle size={12} color={c.success[500]} />,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <CustomHeader title="Product Details" showBack showMenu onMenuPress={() => { }} />
        <ScrollView contentContainerStyle={themedStyles.content}>
          <View style={themedStyles.imageContainer}>
            <Skeleton height={320} />
          </View>
          <View style={themedStyles.details}>
            <Skeleton height={24} width="60%" style={{ marginBottom: spacing.sm }} />
            <Skeleton height={36} width="40%" style={{ marginBottom: spacing.md }} />
            <Skeleton height={60} style={{ marginBottom: spacing.lg }} />
            <Skeleton height={120} style={{ marginBottom: spacing.lg }} />
            <Skeleton height={50} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <CustomHeader title="Product Details" showBack showMenu onMenuPress={() => { }} />
        <View style={themedStyles.errorContainer}>
          <Text style={themedStyles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stockStatus = getStockStatus();

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right']}>
      <CustomHeader title="Product Details" showBack showMenu onMenuPress={() => { }} />

      <ScrollView contentContainerStyle={themedStyles.content} showsVerticalScrollIndicator={false}>
        {/* IMAGE SECTION */}
        <View style={themedStyles.imageContainer}>
          <Image
            source={{ uri: product.image_url || 'https://via.placeholder.com/400' }}
            style={themedStyles.image}
            resizeMode="cover"
          />
        </View>

        {/* DETAILS SECTION */}
        <View style={themedStyles.details}>
          {/* Header Row: Category & Stock Status */}
          <View style={themedStyles.headerRow}>
            <View style={{ flex: 1 }}>
              {product.category && (
                <Badge style={themedStyles.categoryBadge} variant="info">
                  {product.category.name}
                </Badge>
              )}
            </View>
            <View style={themedStyles.stockBadge}>
              <Badge variant={stockStatus.variant}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {stockStatus.icon}
                  <Text>{stockStatus.label}</Text>
                </View>
              </Badge>
            </View>
          </View>

          {/* Product Name */}
          <Text style={themedStyles.name} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Price & Rating Row */}
          <View style={themedStyles.priceRow}>
            <Text style={themedStyles.price}>${product.price.toFixed(2)}</Text>

            {/* Rating Placeholder */}
            <View style={themedStyles.ratingContainer}>
              <Star size={16} fill={c.warning[500]} color={c.warning[500]} />
              <Text style={themedStyles.ratingText}>4.8</Text>
              <Text style={{ ...themedStyles.ratingText, color: c.textSecondary }}>(24)</Text>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View style={themedStyles.section}>
              <Text style={themedStyles.sectionLabel}>Description</Text>
              <Text style={themedStyles.description}>{product.description}</Text>
            </View>
          )}

          {/* Product Metadata */}
          <View style={themedStyles.metaContainer}>
            <View style={themedStyles.metaItem}>
              <Calendar size={14} style={themedStyles.metaIcon} />
              <Text style={themedStyles.metaText}>Added {formatDate(product.created_at)}</Text>
            </View>
            {product.updated_at !== product.created_at && (
              <View style={themedStyles.metaItem}>
                <Calendar size={14} style={themedStyles.metaIcon} />
                <Text style={themedStyles.metaText}>Updated {formatDate(product.updated_at)}</Text>
              </View>
            )}
            <View style={themedStyles.metaItem}>
              <Package size={14} style={themedStyles.metaIcon} />
              <Text style={themedStyles.metaText}>SKU: {product.id.slice(0, 8).toUpperCase()}</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={themedStyles.quantitySection}>
            <Text style={themedStyles.quantityLabel}>Quantity</Text>
            <View style={themedStyles.quantitySelector}>
              <TouchableOpacity
                style={themedStyles.quantityButton}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
                activeOpacity={0.7}
              >
                <Minus size={18} color={quantity <= 1 ? c.textDisabled : c.textPrimary} />
              </TouchableOpacity>
              <Text style={themedStyles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={themedStyles.quantityButton}
                onPress={incrementQuantity}
                disabled={quantity >= product.stock}
                activeOpacity={0.7}
              >
                <Plus size={18} color={quantity >= product.stock ? c.textDisabled : c.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <View style={themedStyles.footer}>
            <Button
              onPress={handleAddToCart}
              fullWidth
              size="lg"
              disabled={product.stock === 0 || !product.is_active}
              leftIcon={product.stock > 0 && product.is_active ? undefined : undefined}
            >
              {product.stock === 0 || !product.is_active ? 'Out of Stock' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
