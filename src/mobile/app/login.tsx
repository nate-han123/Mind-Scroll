import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../config/api';
import { storage } from '../utils/storage';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
      });

      if (response.data) {
        // Save user data
        await storage.saveUser(response.data);
        
        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.detail || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.light.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.light.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.light.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.light.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.light.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.loginButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.signupLinkText}>
                Don't have an account?{' '}
                <Text style={styles.signupLinkBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  backButton: {
    marginBottom: Spacing.lg,
    alignSelf: 'flex-start',
  },
  title: {
    ...Typography.h1,
    fontSize: 36,
    color: '#ffffff',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    paddingVertical: Spacing.md,
    color: Colors.light.text,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  loginButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loginButtonText: {
    ...Typography.h3,
    color: '#ffffff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginHorizontal: Spacing.md,
  },
  signupLink: {
    alignItems: 'center',
  },
  signupLinkText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  signupLinkBold: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});




