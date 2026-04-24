import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export function Card({ children, onPress, style, variant = 'elevated' }: CardProps) {
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const baseStyle: ViewStyle = {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  };

  const variantStyle: ViewStyle = (() => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: themeColors.card,
          ...shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        };
      case 'filled':
        return {
          backgroundColor: themeColors.muted,
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  })();

  const cardStyle = [baseStyle, style, variantStyle];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
