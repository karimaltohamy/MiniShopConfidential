import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react-native';
import { useCartStore } from '../features/cart/store/cartStore';
import { ordersApi } from '../features/orders/api/ordersApi';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, typography, spacing } from '../theme';

export default function CheckoutScreen() {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={colors.success} />
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successMessage}>
            Your order has been successfully placed. You can track it in the Orders tab.
          </Text>
          <Button
            onPress={() => {
              router.replace('/(tabs)/orders');
            }}
            fullWidth
            style={styles.successButton}
          >
            View Orders
          </Button>
          <Button
            onPress={() => {
              router.replace('/(tabs)/');
            }}
            variant="outline"
            fullWidth
          >
            Continue Shopping
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Order Summary</Text>

        <Card style={styles.orderSummary}>
          {items.map((item) => (
            <View key={item.product_id} style={styles.orderItem}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
          </View>
        </Card>

        <View style={styles.footer}>
          <Button
            onPress={handlePlaceOrder}
            loading={createOrderMutation.isPending}
            fullWidth
            size="lg"
          >
            Place Order
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  orderSummary: {
    marginBottom: spacing.lg,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  itemDetails: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[500],
  },
  footer: {
    marginTop: spacing.xl,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  successMessage: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  successButton: {
    marginBottom: spacing.md,
  },
});
