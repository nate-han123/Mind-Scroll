// Type definitions matching backend API

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  primary_health_goal: string;
  intellectual_interests: string[];
  learning_style: string;
  time_availability: string;
  goal_description?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  primary_health_goal: string;
  intellectual_interests: string[];
  learning_style: string;
  time_availability: string;
}

export interface FoodAgentOutput {
  calories: number;
  nutrition_score: number;
  comment: string;
}

export interface ExerciseAgentOutput {
  calories_burned: number;
  note: string;
}

export interface LifestyleAgentOutput {
  wellness_score: number;
  advice: string;
}

export interface OrchestratorSummary {
  overall_health_score: number;
  summary: string;
  recommendations: string[];
}

export interface DailySummary {
  food_agent: FoodAgentOutput;
  exercise_agent: ExerciseAgentOutput;
  lifestyle_agent: LifestyleAgentOutput;
  orchestrator_summary: OrchestratorSummary;
}

export interface DailyEntry {
  date: string;
  meals: string[];
  exercises: string[];
  lifestyle: {
    sleep_hours: number;
    water_intake: number;
    stress_level: number;
  };
  summary?: DailySummary;
}




