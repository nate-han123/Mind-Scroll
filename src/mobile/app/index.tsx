import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../utils/storage';
import { Colors, Spacing, BorderRadius, Typography } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await storage.getUser();
      if (user) {
        // User is logged in, navigate to tabs
        router.replace('/(tabs)');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.container}
      >
        <Text style={styles.loadingText}>MindScroll</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Icon Area */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🧠</Text>
          <Text style={styles.logoText}>MindScroll</Text>
          <Text style={styles.tagline}>Your AI-Powered Health Companion</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem icon="📊" text="Track Your Health" />
          <FeatureItem icon="🤖" text="AI Analysis" />
          <FeatureItem icon="🎯" text="Achieve Your Goals" />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/signup')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: Spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  logoText: {
    ...Typography.h1,
    fontSize: 40,
    color: '#ffffff',
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  loadingText: {
    ...Typography.h1,
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
  },
  featuresContainer: {
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backdropFilter: 'blur(10px)',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  featureText: {
    ...Typography.h3,
    color: '#ffffff',
  },
  buttonsContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    ...Typography.h3,
    color: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  secondaryButtonText: {
    ...Typography.h3,
    color: '#ffffff',
  },
});




