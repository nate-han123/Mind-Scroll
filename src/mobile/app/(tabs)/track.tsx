import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { api } from '../../config/api';
import { storage } from '../../utils/storage';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/colors';

export default function TrackScreen() {
  const [selectedTab, setSelectedTab] = useState<'food' | 'exercise' | 'lifestyle'>('food');
  const [foodInput, setFoodInput] = useState('');
  const [exerciseInput, setExerciseInput] = useState('');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [sleepHours, setSleepHours] = useState('7');
  const [stressLevel, setStressLevel] = useState(3);
  const [screenTime, setScreenTime] = useState('3');
  const [loading, setLoading] = useState(false);
  
  // Store data locally
  const [meals, setMeals] = useState<string[]>([]);
  const [exercises, setExercises] = useState<string[]>([]);

  const handleTabChange = (tab: 'food' | 'exercise' | 'lifestyle') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTab(tab);
  };

  const handleAddFood = () => {
    if (foodInput.trim()) {
      setMeals([...meals, foodInput.trim()]);
      Alert.alert('Success', 'Food logged successfully!');
      setFoodInput('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleAddExercise = () => {
    if (exerciseInput.trim()) {
      setExercises([...exercises, exerciseInput.trim()]);
      Alert.alert('Success', 'Exercise logged successfully!');
      setExerciseInput('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSubmitData = async () => {
    if (meals.length === 0 && exercises.length === 0) {
      Alert.alert('No Data', 'Please log some food or exercise first!');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const user = await storage.getUser();
      if (!user || !user.user_id) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      const payload = {
        user_id: user.user_id,
        meals: meals.length > 0 ? meals : ['No meals logged'],
        exercises: exercises.length > 0 ? exercises : ['No exercises logged'],
        lifestyle: {
          sleep_hours: parseFloat(sleepHours) || 7,
          water_intake: waterGlasses,
          stress_level: stressLevel,
          screen_time: parseFloat(screenTime) || 3,
        },
      };

      const response = await api.post('/generate-personalized-summary', payload);

      if (response.data) {
        // Save the analysis to storage for the dashboard and analysis screens
        await storage.set('latest_analysis', JSON.stringify(response.data));
        
        Alert.alert(
          'Success!',
          'Your data has been analyzed! Check the Dashboard and Analysis tabs for insights.',
          [
            {
              text: 'View Analysis',
              onPress: () => {
                // Navigate to analysis tab
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              },
            },
          ]
        );

        // Reset data
        setMeals([]);
        setExercises([]);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert(
        'Submission Failed',
        error.response?.data?.detail || 'Could not submit your data. Please try again.'
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleWaterIncrement = () => {
    setWaterGlasses(prev => prev + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Colors.gradients.primary} style={styles.header}>
        <Text style={styles.headerTitle}>Track Your Day</Text>
        <Text style={styles.headerSubtitle}>Log your daily activities</Text>
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TabButton
          icon="restaurant"
          label="Food"
          active={selectedTab === 'food'}
          onPress={() => handleTabChange('food')}
        />
        <TabButton
          icon="fitness"
          label="Exercise"
          active={selectedTab === 'exercise'}
          onPress={() => handleTabChange('exercise')}
        />
        <TabButton
          icon="heart"
          label="Lifestyle"
          active={selectedTab === 'lifestyle'}
          onPress={() => handleTabChange('lifestyle')}
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {selectedTab === 'food' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>What did you eat?</Text>
            
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Ionicons name="restaurant-outline" size={20} color={Colors.light.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Oatmeal with berries"
                  placeholderTextColor={Colors.light.placeholder}
                  value={foodInput}
                  onChangeText={setFoodInput}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddFood}
                activeOpacity={0.8}
              >
                <LinearGradient colors={Colors.gradients.primary} style={styles.addButtonGradient}>
                  <Text style={styles.addButtonText}>Log Food</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <QuickAddSection title="Quick Add" items={['Breakfast', 'Lunch', 'Dinner', 'Snack']} />
          </View>
        )}

        {selectedTab === 'exercise' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>What exercise did you do?</Text>
            
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Ionicons name="fitness-outline" size={20} color={Colors.light.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30 min jogging"
                  placeholderTextColor={Colors.light.placeholder}
                  value={exerciseInput}
                  onChangeText={setExerciseInput}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddExercise}
                activeOpacity={0.8}
              >
                <LinearGradient colors={Colors.gradients.ocean} style={styles.addButtonGradient}>
                  <Text style={styles.addButtonText}>Log Exercise</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <QuickAddSection
              title="Popular Exercises"
              items={['Running', 'Gym', 'Cycling', 'Swimming']}
            />
          </View>
        )}

        {selectedTab === 'lifestyle' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Track Your Wellness</Text>

            {/* Water Intake */}
            <View style={styles.card}>
              <View style={styles.lifestyleHeader}>
                <Ionicons name="water" size={24} color={Colors.light.primary} />
                <Text style={styles.lifestyleTitle}>Water Intake</Text>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                >
                  <Ionicons name="remove" size={24} color={Colors.light.primary} />
                </TouchableOpacity>
                <View style={styles.counterValue}>
                  <Text style={styles.counterText}>{waterGlasses}</Text>
                  <Text style={styles.counterLabel}>glasses</Text>
                </View>
                <TouchableOpacity style={styles.counterButton} onPress={handleWaterIncrement}>
                  <Ionicons name="add" size={24} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sleep */}
            <View style={styles.card}>
              <View style={styles.lifestyleHeader}>
                <Ionicons name="moon" size={24} color={Colors.light.secondary} />
                <Text style={styles.lifestyleTitle}>Sleep Duration</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.sleepInput}
                  value={sleepHours}
                  onChangeText={setSleepHours}
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
                <Text style={styles.sleepLabel}>hours</Text>
              </View>
            </View>

            {/* Screen Time */}
            <View style={styles.card}>
              <View style={styles.lifestyleHeader}>
                <Ionicons name="phone-portrait" size={24} color={Colors.light.warning} />
                <Text style={styles.lifestyleTitle}>Screen Time</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.sleepInput}
                  value={screenTime}
                  onChangeText={setScreenTime}
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
                <Text style={styles.sleepLabel}>hours</Text>
              </View>
            </View>

            {/* Stress Level */}
            <View style={styles.card}>
              <View style={styles.lifestyleHeader}>
                <Ionicons name="pulse" size={24} color={Colors.light.error} />
                <Text style={styles.lifestyleTitle}>Stress Level</Text>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setStressLevel(Math.max(1, stressLevel - 1))}
                >
                  <Ionicons name="remove" size={24} color={Colors.light.primary} />
                </TouchableOpacity>
                <View style={styles.counterValue}>
                  <Text style={styles.counterText}>{stressLevel}</Text>
                  <Text style={styles.counterLabel}>out of 10</Text>
                </View>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setStressLevel(Math.min(10, stressLevel + 1))}
                >
                  <Ionicons name="add" size={24} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Submit Button - Always visible */}
        <View style={styles.submitSection}>
          <View style={styles.dataPreview}>
            <Text style={styles.previewText}>
              📊 {meals.length} meal(s) • 💪 {exercises.length} exercise(s) logged
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmitData}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient colors={Colors.gradients.primary} style={styles.submitButtonGradient}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#ffffff" />
                  <Text style={styles.submitButtonText}>Get AI Analysis</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function TabButton({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {active ? (
        <LinearGradient colors={Colors.gradients.primary} style={styles.tabButtonGradient}>
          <Ionicons name={icon} size={20} color="#ffffff" />
          <Text style={styles.tabButtonTextActive}>{label}</Text>
        </LinearGradient>
      ) : (
        <>
          <Ionicons name={icon} size={20} color={Colors.light.textSecondary} />
          <Text style={styles.tabButtonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function QuickAddSection({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.quickAddSection}>
      <Text style={styles.quickAddTitle}>{title}</Text>
      <View style={styles.quickAddGrid}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickAddButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Text style={styles.quickAddButtonText}>{item}</Text>
          </TouchableOpacity>
        ))}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surface,
  },
  tabButtonActive: {
    backgroundColor: 'transparent',
  },
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  tabButtonText: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    ...Typography.small,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
    minHeight: 80,
  },
  addButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    ...Typography.body,
    fontWeight: '600',
    color: '#ffffff',
  },
  quickAddSection: {
    marginTop: Spacing.md,
  },
  quickAddTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAddButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quickAddButtonText: {
    ...Typography.small,
    color: Colors.light.text,
  },
  lifestyleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  lifestyleTitle: {
    ...Typography.h3,
    color: Colors.light.text,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    alignItems: 'center',
  },
  counterText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.text,
  },
  counterLabel: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  sleepInput: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    minWidth: 80,
  },
  sleepLabel: {
    ...Typography.h3,
    color: Colors.light.textSecondary,
  },
  submitSection: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  dataPreview: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  previewText: {
    ...Typography.body,
    color: Colors.light.text,
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  submitButtonText: {
    ...Typography.h3,
    color: '#ffffff',
  },
});




