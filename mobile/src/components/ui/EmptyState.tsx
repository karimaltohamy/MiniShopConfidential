import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, typography } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const containerStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  };

  const iconContainerStyle: ViewStyle = {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: themeColors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    // shadows.md not needed here for simplicity
  };

  const titleStyle: TextStyle = {
    fontSize: 20, // typography.fontSize.xl
    fontWeight: '600' as any,
    color: themeColors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  };

  const descriptionStyle: TextStyle = {
    fontSize: 16, // typography.fontSize.base
    color: themeColors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 16 * 1.75, // lineHeight.relaxed
  };

  const buttonStyle = {
    marginTop: spacing.lg,
    minWidth: 160,
  };

  return (
    <View style={containerStyle}>
      <View style={iconContainerStyle}>
        <Icon size={48} color={themeColors.textSecondary} strokeWidth={1.5} />
      </View>
      <Text style={titleStyle}>{title}</Text>
      {description && <Text style={descriptionStyle}>{description}</Text>}
      {actionLabel && onAction && (
        <Button onPress={onAction} variant="primary" size="md" style={buttonStyle}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
