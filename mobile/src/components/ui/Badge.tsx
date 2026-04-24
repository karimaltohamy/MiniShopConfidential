import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borderRadius } from '../../theme';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: colors.gray[100],
  },
  success: {
    backgroundColor: colors.success[500] + '15',
  },
  warning: {
    backgroundColor: colors.warning[500] + '15',
  },
  error: {
    backgroundColor: colors.error[500] + '15',
  },
  info: {
    backgroundColor: colors.info[500] + '15',
  },
  text: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  text_default: {
    color: colors.gray[700],
  },
  text_success: {
    color: colors.success[500],
  },
  text_warning: {
    color: colors.warning[500],
  },
  text_error: {
    color: colors.error[500],
  },
  text_info: {
    color: colors.info[500],
  },
});
