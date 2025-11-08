import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import { api } from '../../config/api';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [healthScore, setHealthScore] = useState(7.5);
  const [analysis, setAnalysis] = useState<any>(null);
  const [calories, setCalories] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    loadUserData();
    loadAnalysisData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storage.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadAnalysisData = async () => {
    try {
      const analysisData = await storage.get('latest_analysis');
      if (analysisData) {
        const parsed = JSON.parse(analysisData);
        setAnalysis(parsed);
        setHealthScore(parsed.orchestrator_summary?.overall_health_score || 7.5);
        setCalories(parsed.food_agent?.calories || 0);
        setCaloriesBurned(parsed.exercise_agent?.calories_burned || 0);
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    await loadAnalysisData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}!</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Health Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your Health Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{healthScore}</Text>
            <Text style={styles.scoreMax}>/10</Text>
          </View>
          <Text style={styles.scoreStatus}>Great Progress! 🎉</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            label="Calories"
            value={calories > 0 ? calories.toString() : '--'}
            color={Colors.gradients.fire}
          />
          <StatCard
            icon="fitness"
            label="Burned"
            value={caloriesBurned > 0 ? `${caloriesBurned} cal` : '--'}
            color={Colors.gradients.ocean}
          />
          <StatCard
            icon="nutrition"
            label="Nutrition"
            value={analysis?.food_agent?.nutrition_score ? `${analysis.food_agent.nutrition_score}/10` : '--'}
            color={Colors.gradients.sunset}
          />
          <StatCard
            icon="heart"
            label="Wellness"
            value={analysis?.lifestyle_agent?.wellness_score ? `${analysis.lifestyle_agent.wellness_score}/10` : '--'}
            color={Colors.gradients.primary}
          />
        </View>

        {/* Today's Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <View style={styles.card}>
            <GoalItem
              icon="nutrition"
              label="Balanced Meals"
              progress={0.75}
              current="3"
              target="4"
            />
            <GoalItem
              icon="barbell"
              label="Exercise Time"
              progress={0.6}
              current="45"
              target="60"
              unit="min"
            />
            <GoalItem
              icon="water"
              label="Water Intake"
              progress={0.75}
              current="6"
              target="8"
              unit="glasses"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            <ActivityItem
              icon="restaurant"
              title="Breakfast logged"
              time="2h ago"
              color={Colors.light.success}
            />
            <ActivityItem
              icon="bicycle"
              title="Morning run completed"
              time="3h ago"
              color={Colors.light.primary}
            />
            <ActivityItem
              icon="bed"
              title="Sleep data synced"
              time="8h ago"
              color={Colors.light.secondary}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <View style={styles.statCard}>
      <LinearGradient colors={color} style={styles.statIconContainer}>
        <Ionicons name={icon} size={24} color="#ffffff" />
      </LinearGradient>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function GoalItem({ icon, label, progress, current, target, unit = '' }: any) {
  return (
    <View style={styles.goalItem}>
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          <Ionicons name={icon} size={20} color={Colors.light.primary} />
          <Text style={styles.goalLabel}>{label}</Text>
        </View>
        <Text style={styles.goalProgress}>
          {current}/{target} {unit}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

function ActivityItem({ icon, title, time, color }: any) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
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
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    ...Typography.h1,
    color: '#ffffff',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  scoreLabel: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.md,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
  },
  scoreMax: {
    ...Typography.h3,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scoreStatus: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    backgroundColor: '#ffffff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h2,
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
  goalItem: {
    marginBottom: Spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  goalLabel: {
    ...Typography.body,
    color: Colors.light.text,
    fontWeight: '600',
  },
  goalProgress: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.body,
    color: Colors.light.text,
    marginBottom: 2,
  },
  activityTime: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
});




