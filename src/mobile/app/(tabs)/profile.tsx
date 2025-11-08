import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { storage } from '../../utils/storage';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storage.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradients.primary} style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Health Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.card}>
            <InfoRow icon="calendar" label="Age" value={`${user?.age || 0} years`} />
            <InfoRow icon="fitness" label="Weight" value={`${user?.weight || 0} kg`} />
            <InfoRow icon="resize" label="Height" value={`${user?.height || 0} cm`} />
            <InfoRow
              icon="person"
              label="Gender"
              value={user?.gender || 'Not specified'}
            />
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          <View style={styles.card}>
            <View style={styles.goalCard}>
              <Ionicons name="flag" size={24} color={Colors.light.primary} />
              <Text style={styles.goalText}>
                {user?.primary_health_goal || 'Stay healthy'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
            <SettingsRow
              icon="shield-checkmark-outline"
              label="Privacy"
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
            <SettingsRow
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
            <SettingsRow
              icon="information-circle-outline"
              label="About"
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={20} color={Colors.light.primary} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SettingsRow({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsLeft}>
        <Ionicons name={icon} size={20} color={Colors.light.textSecondary} />
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    ...Typography.h2,
    color: '#ffffff',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.text,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
  },
  goalText: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingsLabel: {
    ...Typography.body,
    color: Colors.light.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.light.error,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.error,
  },
  version: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});




