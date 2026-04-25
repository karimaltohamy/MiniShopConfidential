import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Alert, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react-native';
import { useCartStore } from '../features/cart/store/cartStore';
import { ordersApi } from '../features/orders/api/ordersApi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { spacing, borderRadius, typography } from '../theme';
import { CustomHeader } from '../components/navigation/CustomHeader';
import { useTheme } from '../contexts/ThemeContext';

export default function CheckoutScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      container: {
        flex: 1,
        backgroundColor: c.surface,
      } as ViewStyle,
      content: {
        padding: spacing.md,
      } as ViewStyle,
      title: {
        fontSize: 24, // typography.fontSize['2xl']
        fontWeight: '700' as any,
        color: c.textPrimary,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
      } as TextStyle,
      orderSummary: {
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: c.border,
      } as ViewStyle,
      orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      } as ViewStyle,
      itemDetails: {
        flex: 1,
        marginRight: spacing.md,
      } as ViewStyle,
      itemName: {
        fontSize: 16, // typography.fontSize.base
        color: c.textPrimary,
        marginBottom: 2,
      } as TextStyle,
      itemQuantity: {
        fontSize: 14, // typography.fontSize.sm
        color: c.textSecondary,
      } as TextStyle,
      itemPrice: {
        fontSize: 16, // typography.fontSize.base
        fontWeight: '600' as any,
        color: c.textPrimary,
      } as TextStyle,
      divider: {
        height: 1,
        backgroundColor: c.border,
        marginVertical: spacing.md,
      } as ViewStyle,
      totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
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
      footer: {
        marginTop: spacing.xl,
      } as ViewStyle,
      successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      } as ViewStyle,
      successTitle: {
        fontSize: 30, // typography.fontSize['3xl']
        fontWeight: '700' as any,
        color: c.textPrimary,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
      } as TextStyle,
      successMessage: {
        fontSize: 16, // typography.fontSize.base
        color: c.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
      } as TextStyle,
      successButton: {
        marginBottom: spacing.md,
      } as ViewStyle,
    }),
    [c]
  );

  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      setOrderPlaced(true);
      clearCart();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to place order');
    },
  });

  const handlePlaceOrder = () => {
    const orderItems = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price,
    }));
    createOrderMutation.mutate({ items: orderItems });
  };

  if (orderPlaced) {
    return (
      <SafeAreaView style={themedStyles.container}>
        {/* <CustomHeader title="Checkout" showBack={false} /> */}
        <View style={themedStyles.successContainer}>
          <CheckCircle size={80} color={c.success[500]} />
          <Text style={themedStyles.successTitle}>Order Placed!</Text>
          <Text style={themedStyles.successMessage}>
            Your order has been successfully placed. You can track it in the Orders tab.
          </Text>
          <Button onPress={() => router.replace('/(tabs)/orders')} fullWidth style={themedStyles.successButton}>
            View Orders
          </Button>
          <Button onPress={() => router.replace('/(tabs)')} variant="outline" fullWidth>
            Continue Shopping
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Checkout" showBack />
      <ScrollView contentContainerStyle={themedStyles.content}>
        <Text style={themedStyles.title}>Order Summary</Text>

        <Card style={themedStyles.orderSummary}>
          {items.map((item) => (
            <View key={item.product_id} style={themedStyles.orderItem}>
              <View style={themedStyles.itemDetails}>
                <Text style={themedStyles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={themedStyles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={themedStyles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={themedStyles.divider} />

          <View style={themedStyles.totalRow}>
            <Text style={themedStyles.totalLabel}>Total</Text>
            <Text style={themedStyles.totalAmount}>${getTotal().toFixed(2)}</Text>
          </View>
        </Card>

        <View style={themedStyles.footer}>
          <Button onPress={handlePlaceOrder} loading={createOrderMutation.isPending} fullWidth size="lg">
            Place Order
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
