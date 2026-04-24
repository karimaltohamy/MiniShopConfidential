import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password';
}

export function Input({
  label,
  error,
  type = 'text',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  const themeColors = theme.colors;

  const isPassword = type === 'password';
  const keyboardType = type === 'email' ? 'email-address' : 'default';

  const containerStyle: ViewStyle = { marginBottom: spacing.md };

  const labelStyle: TextStyle = {
    fontSize: 14, // using fixed size; could use typography
    fontWeight: '500' as any,
    color: themeColors.textPrimary,
    marginBottom: 4,
  };

  const inputWrapperBase: ViewStyle = {
    position: 'relative',
    backgroundColor: themeColors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: themeColors.border,
  };

  const inputWrapperStyle: ViewStyle = isFocused
    ? { ...inputWrapperBase, borderColor: themeColors.primary[500] }
    : error
    ? { ...inputWrapperBase, borderColor: themeColors.error[500] }
    : inputWrapperBase;

  const inputStyle: TextStyle = {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: themeColors.textPrimary,
  };

  const inputWithIconStyle: TextStyle = { paddingRight: 48 };

  const iconButtonStyle: ViewStyle = {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: themeColors.error[500],
    marginTop: 4,
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputWrapperStyle}>
        <TextInput
          style={[inputStyle, isPassword && inputWithIconStyle]}
          placeholderTextColor={themeColors.textDisabled}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity style={iconButtonStyle} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color={themeColors.textSecondary} />
            ) : (
              <Eye size={20} color={themeColors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
}
