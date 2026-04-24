import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, LogOut, Info, Settings, CreditCard, Moon, Sun } from 'lucide-react-native';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { CustomHeader } from '../../components/navigation/CustomHeader';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { user, profile, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const themeColors = theme.colors;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background
    },
    content: {
      padding: spacing.md,
    },
    userCard: {
      alignItems: 'center',
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderColor: themeColors.border

    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    name: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.xs,
    },
    email: {
      fontSize: typography.fontSize.base,
      marginBottom: spacing.sm,
    },
    roleBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 16,
    },
    roleText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    },
    infoCard: {
      padding: spacing.md,
      marginBottom: spacing.md,
      borderColor: themeColors.border
    },
    themeCard: {
      // same as infoCard, just for clarity
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    infoText: {
      marginLeft: spacing.md,
      flex: 1,
    },
    infoLabel: {
      fontSize: typography.fontSize.sm,
    },
    infoValue: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
    },
    logoutButton: {
      // borderColor set dynamically
    },
    logoutContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    logoutText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      marginLeft: spacing.sm,
    },
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container]} edges={['left', 'right', 'bottom']}>
      <CustomHeader title="Profile" showBack={false} showMenu />
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <Card style={{ ...styles.userCard, backgroundColor: themeColors.card }}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary[100] }]}>
            <User size={48} color={themeColors.primary[500]} />
          </View>
          <Text style={[styles.name, { color: themeColors.textPrimary }]}>{profile?.name || 'User'}</Text>
          <Text style={[styles.email, { color: themeColors.textSecondary }]}>{user?.email}</Text>
          {profile?.role && (
            <View style={[styles.roleBadge, { backgroundColor: themeColors.primary[100] }]}>
              <Text style={[styles.roleText, { color: themeColors.primary[700] }]}>
                {profile.role === 'admin' ? 'Admin' : 'Customer'}
              </Text>
            </View>
          )}
        </Card>

        {/* App Info */}
        <Card style={{ ...styles.infoCard, backgroundColor: themeColors.card }}>
          <View style={styles.infoRow}>
            <Info size={20} color={themeColors.textSecondary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Version</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>1.0.0</Text>
            </View>
          </View>
        </Card>

        {/* Dark Mode Toggle */}
        <Card style={{ ...styles.infoCard, ...styles.themeCard, backgroundColor: themeColors.card }}>
          <View style={styles.themeRow}>
            <View style={styles.themeInfo}>
              {isDark ? (
                <Moon size={20} color={themeColors.primary[500]} />
              ) : (
                <Sun size={20} color={themeColors.primary[500]} />
              )}
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                  {isDark ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: themeColors.gray[300], true: themeColors.primary[500] }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={{ ...styles.logoutButton, borderColor: themeColors.error[500] }}
        >
          <View style={styles.logoutContent}>
            <LogOut size={20} color={themeColors.error[500]} />
            <Text style={[styles.logoutText, { color: themeColors.error[500] }]}>Logout</Text>
          </View>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}


