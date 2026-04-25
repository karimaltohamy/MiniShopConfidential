import React, { useMemo } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Package, ShoppingBag, ShoppingCart, User } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useCartStore } from '../../features/cart/store/cartStore';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabLayout() {
  const { user } = useAuth();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { theme, isDark } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () => ({
      badgeBackground: {
        backgroundColor: c.error[500],
      },
    }),
    [c]
  );

  function TabBarBadge({ count }: { count: number }) {
    if (count === 0) return null;

    return (
      <View style={[styles.badge, themedStyles.badgeBackground]}>
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: c.primary[500],
        tabBarInactiveTintColor: isDark ? c.gray[400] : c.gray[500],
        tabBarStyle: {
          backgroundColor: isDark ? c.card : c.surface,
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
          shadowColor: isDark ? '#000' : c.primary[500],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.3 : 0.15,
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
                backgroundColor: isDark ? c.card : c.surface,
              },
            ]}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        headerShown: false,
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
        name="orders/[id]"
        options={{
          href: null
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
