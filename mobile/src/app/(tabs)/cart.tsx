import React, { useMemo } from 'react';
import { View, Text, FlatList, Alert, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ShoppingCart, Trash2 } from 'lucide-react-native';
import { useCartStore } from '../../features/cart/store/cartStore';
import { CartItem } from '../../components/cart/CartItem';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { spacing, borderRadius } from '../../theme';
import { CustomHeader } from '../../components/navigation/CustomHeader';
import { useTheme } from '../../contexts/ThemeContext';

export default function CartScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.background,
      } as ViewStyle,
      list: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
      } as ViewStyle,
      footer: {
        backgroundColor: c.card,
        borderTopWidth: 1,
        borderTopColor: c.border,
        padding: spacing.md,
        paddingBottom: spacing.lg,
        marginBottom: spacing['3xl' as keyof typeof spacing] as number, // cast to access '3xl'
      } as ViewStyle,
      totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingHorizontal: spacing.sm,
      } as ViewStyle,
      totalLabel: {
        fontSize: 18, // typography.fontSize.lg
        fontWeight: '600' as any,
        color: c.textPrimary,
      } as TextStyle,
      totalAmount: {
        fontSize: 24, // typography.fontSize['2xl']
        fontWeight: '700' as any,
        color: c.primary[500],
      } as TextStyle,
    }),
    [c]
  );

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);

  const handleIncrement = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      handleRemove(productId);
    }
  };

  const handleRemove = (productId: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(productId) },
    ]);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader title="Cart" showBack={false} />
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to get started"
          actionLabel="Start Shopping"
          onAction={() => router.push('/(tabs)')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Cart" showBack={false} />
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartItem
            id={item.product_id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            image_url={item.image_url}
            onIncrement={() => handleIncrement(item.product_id, item.quantity)}
            onDecrement={() => handleDecrement(item.product_id, item.quantity)}
            onRemove={() => handleRemove(item.product_id)}
          />
        )}
        keyExtractor={(item) => item.product_id}
        contentContainerStyle={themedStyles.list}
      />

      <View style={themedStyles.footer}>
        <View style={themedStyles.totalRow}>
          <Text style={themedStyles.totalLabel}>Total</Text>
          <Text style={themedStyles.totalAmount}>${getTotal().toFixed(2)}</Text>
        </View>
        <Button onPress={handleCheckout} fullWidth size="lg">
          Proceed to Checkout
        </Button>
      </View>
    </SafeAreaView>
  );
}
