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

// Railway Backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mind-scroll-production.up.railway.app";

export async function fetchSummary(): Promise<DailySummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/generate-summary`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

export async function fetchSummaryFromUserData(userData: {
  meals: string[];
  exercises: string[];
  lifestyle: any;
}): Promise<DailySummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/generate-summary-from-user-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching summary from user data:', error);
    throw error;
  }
}
