import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ShoppingCart, Search, MoreVertical } from 'lucide-react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  cartItemCount?: number;
  onBackPress?: () => void;
  onCartPress?: () => void;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  gradient?: boolean;
}

export function CustomHeader({
  title,
  subtitle,
  showBack = true,
  showCart = false,
  showSearch = false,
  showMenu = false,
  cartItemCount = 0,
  onBackPress,
  onCartPress,
  onSearchPress,
  onMenuPress,
  rightAction,
  transparent = false,
}: CustomHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={transparent ? 'transparent' : colors.primary[700]}
        translucent
      />
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: transparent ? 'transparent' : colors.primary[600],
          },
        ]}
      >
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={28} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightAction}
            {showSearch && (
              <TouchableOpacity
                onPress={onSearchPress}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Search size={22} color="#fff" />
              </TouchableOpacity>
            )}
            {showCart && (
              <TouchableOpacity
                onPress={onCartPress}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={styles.cartIconContainer}>
                  <ShoppingCart size={22} color="#fff" />
                  {cartItemCount > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {showMenu && (
              <TouchableOpacity
                onPress={onMenuPress}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MoreVertical size={22} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {/* Spacer to push content below the header */}
      {/* <View style={{ height: insets.top }} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: spacing.xs,
  },
  titleContainer: {
    marginLeft: spacing.sm,
    flex: 1,
    minWidth: 200,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#fff',
    letterSpacing: 0.5,
    width: "100%"
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    minWidth: 200
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -8,
    backgroundColor: colors.error[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
