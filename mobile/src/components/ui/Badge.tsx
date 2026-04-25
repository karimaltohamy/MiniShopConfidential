import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, typography } from '../../theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success':
        return themeColors.success[500] + '15';
      case 'warning':
        return themeColors.warning[500] + '15';
      case 'error':
        return themeColors.error[500] + '15';
      case 'info':
        return themeColors.info[500] + '15';
      default:
        return themeColors.gray[200];
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'success':
        return themeColors.success[500];
      case 'warning':
        return themeColors.warning[500];
      case 'error':
        return themeColors.error[500];
      case 'info':
        return themeColors.info[500];
      default:
        return themeColors.gray[700];
    }
  };

  const badgeStyle: ViewStyle = {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    backgroundColor: getBackgroundColor(),
  };

  const textStyle: TextStyle = {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: getTextColor(),
  };

   return (
     <View style={[badgeStyle, style]}>
       {typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children}
     </View>
   );
 };
