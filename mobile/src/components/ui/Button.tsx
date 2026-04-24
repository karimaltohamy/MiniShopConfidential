import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, borderRadius } from '../../theme';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
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
  style,
}: ButtonProps) {
  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...styles[variant],
    ...styles[`size_${size}`],
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
  };

  const textStyle: TextStyle = {
    ...styles.text,
    ...styles[`text_${variant}`],
    ...styles[`textSize_${size}`],
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : colors.primary[500]}
        />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.gray[100],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  text_primary: {
    color: '#fff',
  },
  text_secondary: {
    color: colors.textPrimary,
  },
  text_outline: {
    color: colors.primary[500],
  },
  text_ghost: {
    color: colors.primary[500],
  },
  textSize_sm: {
    fontSize: typography.fontSize.sm,
  },
  textSize_md: {
    fontSize: typography.fontSize.base,
  },
  textSize_lg: {
    fontSize: typography.fontSize.lg,
  },
});
