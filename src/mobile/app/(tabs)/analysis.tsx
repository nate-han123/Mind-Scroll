import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { api } from '../../config/api';
import { storage } from '../../utils/storage';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/colors';

export default function AnalysisScreen() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    loadLatestAnalysis();
  }, []);

  const loadLatestAnalysis = async () => {
    try {
      const analysisData = await storage.get('latest_analysis');
      if (analysisData) {
        setAnalysis(JSON.parse(analysisData));
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
    }
  };

  const generateAnalysis = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const user = await storage.getUser();
      
      // Mock data for demonstration
      const response = await api.post('/generate-summary-from-user-data', {
        meals: ['Breakfast: Oatmeal with berries', 'Lunch: Chicken salad'],
        exercises: ['30 min jogging'],
        lifestyle: {
          sleep_hours: 7,
          water_intake: 6,
          stress_level: 3,
        },
      });

      if (response.data) {
        setAnalysis(response.data);
        await storage.set('latest_analysis', JSON.stringify(response.data));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        'Could not generate analysis. Please try again.'
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradients.primary} style={styles.header}>
        <Text style={styles.headerTitle}>AI Analysis</Text>
        <Text style={styles.headerSubtitle}>Get personalized insights</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {!analysis ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.emptyIconGradient}
              >
                <Ionicons name="analytics" size={64} color="#ffffff" />
              </LinearGradient>
            </View>
            <Text style={styles.emptyTitle}>Ready for Your Analysis?</Text>
            <Text style={styles.emptySubtitle}>
              Our AI will analyze your health data and provide personalized recommendations
            </Text>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateAnalysis}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.generateButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={20} color="#ffffff" />
                    <Text style={styles.generateButtonText}>Generate Analysis</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.analysisContainer}>
            {/* Overall Score */}
            <View style={styles.scoreCard}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.scoreCardGradient}
              >
                <Text style={styles.scoreCardLabel}>Overall Health Score</Text>
                <View style={styles.scoreDisplay}>
                  <Text style={styles.scoreValue}>
                    {analysis.orchestrator_summary?.overall_health_score || 0}
                  </Text>
                  <Text style={styles.scoreMax}>/10</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Summary */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="chatbubble-ellipses" size={24} color={Colors.light.primary} />
                <Text style={styles.cardTitle}>AI Summary</Text>
              </View>
              <Text style={styles.cardText}>
                {analysis.orchestrator_summary?.summary || 'No summary available'}
              </Text>
            </View>

            {/* Food Analysis */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="restaurant" size={24} color={Colors.gradients.fire[0]} />
                <Text style={styles.cardTitle}>Nutrition</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Calories</Text>
                <Text style={styles.metricValue}>
                  {analysis.food_agent?.calories || 0} kcal
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Nutrition Score</Text>
                <Text style={styles.metricValue}>
                  {analysis.food_agent?.nutrition_score || 0}/10
                </Text>
              </View>
              <Text style={styles.cardText}>
                {analysis.food_agent?.comment || 'No data'}
              </Text>
            </View>

            {/* Exercise Analysis */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="fitness" size={24} color={Colors.gradients.ocean[0]} />
                <Text style={styles.cardTitle}>Exercise</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Calories Burned</Text>
                <Text style={styles.metricValue}>
                  {analysis.exercise_agent?.calories_burned || 0} kcal
                </Text>
              </View>
              <Text style={styles.cardText}>
                {analysis.exercise_agent?.note || 'No data'}
              </Text>
            </View>

            {/* Lifestyle Analysis */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="heart" size={24} color={Colors.gradients.sunset[1]} />
                <Text style={styles.cardTitle}>Wellness</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Wellness Score</Text>
                <Text style={styles.metricValue}>
                  {analysis.lifestyle_agent?.wellness_score || 0}/10
                </Text>
              </View>
              <Text style={styles.cardText}>
                {analysis.lifestyle_agent?.advice || 'No data'}
              </Text>
            </View>

            {/* Recommendations */}
            {analysis.orchestrator_summary?.recommendations?.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="bulb" size={24} color={Colors.light.warning} />
                  <Text style={styles.cardTitle}>Recommendations</Text>
                </View>
                {analysis.orchestrator_summary.recommendations.map((rec: string, idx: number) => (
                  <View key={idx} style={styles.recommendationItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.light.success}
                    />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Regenerate Button */}
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={generateAnalysis}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color={Colors.light.primary} />
              <Text style={styles.regenerateButtonText}>Regenerate Analysis</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h1,
    color: '#ffffff',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIconContainer: {
    marginBottom: Spacing.xl,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  generateButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  generateButtonText: {
    ...Typography.h3,
    color: '#ffffff',
  },
  analysisContainer: {
    paddingBottom: Spacing.xl,
  },
  scoreCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreCardGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  scoreCardLabel: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.md,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
  },
  scoreMax: {
    ...Typography.h2,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.light.text,
  },
  cardText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginBottom: Spacing.sm,
  },
  metricLabel: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  metricValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.text,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  recommendationText: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  regenerateButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});




