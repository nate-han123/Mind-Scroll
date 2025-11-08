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

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.age) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        name: formData.name.trim(),
        age: parseInt(formData.age) || 25,
        gender: formData.gender,
        weight: parseFloat(formData.weight) || 70,
        height: parseFloat(formData.height) || 170,
        activity_level: 'moderately_active',
        primary_health_goal: 'Stay healthy and focused on studies',
        intellectual_interests: ['Technology', 'Science'],
        learning_style: 'visual',
        time_availability: '1-2 hours daily',
      };

      const response = await api.post('/auth/signup', signupData);

      if (response.data) {
        // Save user data
        await storage.saveUser(response.data);
        
        Alert.alert(
          'Success!',
          'Your account has been created successfully',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error.response?.data?.detail || 'Could not create account. Please try again.'
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MindScroll today</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <InputField
              icon="person-outline"
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <InputField
              icon="mail-outline"
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

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
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
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

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.light.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={Colors.light.placeholder}
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text })}
                  keyboardType="number-pad"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Ionicons
                  name="body-outline"
                  size={20}
                  color={Colors.light.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Weight (kg)"
                  placeholderTextColor={Colors.light.placeholder}
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.signupButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.loginLinkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function InputField({ icon, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={20}
        color={Colors.light.textSecondary}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.light.placeholder}
        {...props}
      />
    </View>
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
    marginBottom: Spacing.xl,
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  signupButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  signupButtonText: {
    ...Typography.h3,
    color: '#ffffff',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  loginLinkText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  loginLinkBold: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});




