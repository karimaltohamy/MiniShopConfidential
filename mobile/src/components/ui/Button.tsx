import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, shadows, spacing, typography } from '../../theme';

interface ButtonProps {
  onPress: (e?: any) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  style?: ViewStyle;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const baseStyle: ViewStyle = {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.sm,
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: themeColors.primary[500] };
      case 'secondary':
        return { backgroundColor: themeColors.gray[200] };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: themeColors.primary[500],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          ...Platform.select({
            ios: { shadowOpacity: 0 },
            android: { elevation: 0 },
          }),
        };
      default:
        return {};
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, minHeight: 52 };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => ({
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.3,
  });

  const getTextVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: '#ffffff' };
      case 'secondary':
        return { color: themeColors.textPrimary };
      case 'outline':
        return { color: themeColors.primary[500] };
      case 'ghost':
        return { color: themeColors.primary[500] };
      default:
        return {};
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: typography.fontSize.sm };
      case 'md':
        return { fontSize: typography.fontSize.base };
      case 'lg':
        return { fontSize: typography.fontSize.lg };
      default:
        return {};
    }
  };

  const buttonStyle: ViewStyle = {
    ...baseStyle,
    ...getVariantStyle(),
    ...getSizeStyle(),
    ...(fullWidth ? { width: '100%' } : {}),
    ...(disabled ? { opacity: 0.5 } : {}),
    ...style,
  };

  const combinedTextStyle: TextStyle = {
    ...getTextStyle(),
    ...getTextVariantStyle(),
    ...getTextSizeStyle(),
  };

  const isString = typeof children === 'string';

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : themeColors.primary[500]} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs }}>
          {LeftIcon && <LeftIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} style={{ marginRight: spacing.xs }} />}
          {isString ? <Text style={combinedTextStyle}>{children}</Text> : children}
          {RightIcon && <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} style={{ marginLeft: spacing.xs }} />}
        </View>
      )}
    </TouchableOpacity>
  );
}
