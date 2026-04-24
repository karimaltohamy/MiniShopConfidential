import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { ShoppingBag, ShoppingCart, Package, User } from 'lucide-react-native';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useCartStore } from '../../features/cart/store/cartStore';
import { colors } from '../../theme';

function TabBarBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { user } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: isDark ? colors.gray[400] : colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.gray[500],
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          height: 70,
          paddingBottom: 16,
          paddingTop: 8,
          borderRadius: 50,
          position: 'absolute',
          bottom: 20,
          marginHorizontal: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 12,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={30}
            tint={isDark ? 'dark' : 'light'}
            style={[
              styles.blurContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(11, 19, 38, 0.5)'
                  : 'rgba(250, 249, 246, 0.85)',
              },
            ]}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        headerShown: false, // Hide native headers; we use CustomHeader in each screen
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingCart size={size} color={color} />
              <TabBarBadge count={itemCount} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Package size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: colors.error[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 20,
  },
});
