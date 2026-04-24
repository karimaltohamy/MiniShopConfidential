import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ShoppingCart, Search, MoreVertical } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme';

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
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  // Use primary color for header background
  const headerBackground = transparent ? 'transparent' : themeColors.primary[600];
  const headerTextColor = '#ffffff';

  const containerStyle: ViewStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: headerBackground,
    paddingTop: insets.top,
  };

  const contentStyle: ViewStyle = {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  };

  const iconButtonStyle: ViewStyle = {
    padding: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: spacing.xs,
  };

  const titleStyle: TextStyle = {
    fontSize: 20, // typography.fontSize.xl
    fontWeight: '700' as any,
    color: headerTextColor,
    letterSpacing: 0.5,
    width: '100%' as any,
  };

  const subtitleStyle: TextStyle = {
    fontSize: 12, // typography.fontSize.xs
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    minWidth: 200,
  };

  const cartBadgeStyle: ViewStyle = {
    position: 'absolute',
    right: -6,
    top: -8,
    backgroundColor: themeColors.error[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: themeColors.primary[500],
  };

  const cartBadgeTextStyle: TextStyle = {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={transparent ? 'transparent' : themeColors.primary[600]}
        translucent
      />
      <View style={containerStyle}>
        <View style={contentStyle}>
          {/* Left Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {showBack && (
              <TouchableOpacity
                onPress={handleBack}
                style={iconButtonStyle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={28} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={{ marginLeft: spacing.sm, flex: 1, minWidth: 200 }}>
              <Text style={titleStyle} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
            </View>
          </View>

          {/* Right Section */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
            {rightAction}
            {showSearch && (
              <TouchableOpacity
                onPress={onSearchPress}
                style={iconButtonStyle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Search size={22} color="#fff" />
              </TouchableOpacity>
            )}
            {showCart && (
              <TouchableOpacity
                onPress={onCartPress}
                style={iconButtonStyle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={{ position: 'relative' }}>
                  <ShoppingCart size={22} color="#fff" />
                  {cartItemCount > 0 && (
                    <View style={cartBadgeStyle}>
                      <Text style={cartBadgeTextStyle}>
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
                style={iconButtonStyle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MoreVertical size={22} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
}
