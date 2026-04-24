import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

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

  const isPassword = type === 'password';
  const keyboardType =
    type === 'email' ? 'email-address' : 'default';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            isPassword && styles.inputWithIcon,
          ]}
          placeholderTextColor={colors.gray[400]}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.gray[400]} />
            ) : (
              <Eye size={20} color={colors.gray[400]} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  error: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
