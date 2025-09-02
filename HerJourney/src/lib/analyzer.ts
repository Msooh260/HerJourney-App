/**
 * Health analyzer with rules-based risk scoring
 * NOT MEDICAL ADVICE - Educational purposes only
 */

import { AnalyzerEntry } from './storage';

export interface AnalyzerResult {
  score: number;
  level: "ok" | "heads_up" | "red_flag";
  messages: string[];
  recommendations: string[];
}

/**
 * Analyze health inputs and provide risk assessment
 */
export const analyzeHealthInputs = (entry: AnalyzerEntry): AnalyzerResult => {
  let score = 0;
  const messages: string[] = [];
  const recommendations: string[] = [];

  // CRITICAL: Always add medical disclaimer
  const medicalDisclaimer = "⚠️ This is not medical advice. If you have concerns, kindly contact a healthcare professional.";

  // Check for immediate red flag symptoms
  const redFlagSymptoms = [
    { condition: entry.bleeding, message: "Unexpected bleeding should be evaluated immediately" },
    { condition: entry.fever, message: "Fever during pregnancy needs medical attention" },
    { condition: entry.severePain, message: "Severe pain should be evaluated promptly" },
    { condition: entry.headachesVision, message: "Severe headaches or vision changes need immediate attention" },
    { condition: entry.swelling, message: "Sudden swelling could indicate complications" }
    
  ];

  let hasRedFlag = false;
  redFlagSymptoms.forEach(symptom => {
    if (symptom.condition) {
      score += 5;
      messages.push(`🚨 ${symptom.message}`);
      hasRedFlag = true;
    }
  });

  // Lifestyle factors scoring
  if (entry.caffeineMg && entry.caffeineMg > 200) {
    score += 2;
    messages.push("High caffeine intake detected");
    recommendations.push("Consider reducing caffeine to under 200mg per day");
  }

  if (entry.alcoholDrinks && entry.alcoholDrinks > 0) {
    score += 3;
    messages.push("Alcohol consumption noted");
    recommendations.push("Alcohol is not recommended during pregnancy");
  }

  if (entry.smoked) {
    score += 3;
    messages.push("Smoking detected");
    recommendations.push("Consider smoking cessation resources");
  }

  if (entry.sleepHours && entry.sleepHours < 6) {
    score += 1;
    messages.push("Limited sleep noted");
    recommendations.push("Aim for 7-9 hours of sleep per night");
  }

  if (entry.exerciseMins && entry.exerciseMins < 150) {
    score += 1;
    recommendations.push("Consider gentle exercise like walking or prenatal yoga");
  }

  if (entry.waterCups && entry.waterCups < 6) {
    score += 1;
    messages.push("Low water intake");
    recommendations.push("Aim for 8-10 glasses of water daily");
  }

  if (entry.prenatalVitamin === false) {
    score += 1;
    recommendations.push("Consider taking prenatal vitamins as recommended by your provider");
  }

  // Determine level based on score and red flags
  let level: "ok" | "heads_up" | "red_flag";
  if (hasRedFlag || score >= 5) {
    level = "red_flag";
    messages.unshift("🚨 Some concerning items detected - please contact your healthcare provider");
  } else if (score >= 2) {
    level = "heads_up";
    messages.unshift("⚠️ A few areas could use attention");
  } else {
    level = "ok";
    messages.unshift("✅ Overall looking good!");
  }

  // Add positive reinforcements when appropriate
  if (level === "ok") {
    if (entry.prenatalVitamin) recommendations.push("Great job taking your prenatal vitamins!");
    if (entry.waterCups && entry.waterCups >= 8) recommendations.push("Excellent hydration!");
    if (entry.exerciseMins && entry.exerciseMins >= 150) recommendations.push("Fantastic activity level!");
  }

  // Always include disclaimer
  messages.push(medicalDisclaimer);

  return {
    score: Math.max(0, score),
    level,
    messages,
    recommendations
  };
};

/**
 * Get color theme for analyzer level
 */
export const getAnalyzerLevelColor = (level: "ok" | "heads_up" | "red_flag"): string => {
  switch (level) {
    case "ok":
      return "text-success bg-success/10";
    case "heads_up":
      return "text-warning bg-warning/10";
    case "red_flag":
      return "text-destructive bg-destructive/10";
    default:
      return "text-muted-foreground";
  }
};

/**
 * Get display text for analyzer level
 */
export const getAnalyzerLevelText = (level: "ok" | "heads_up" | "red_flag"): string => {
  switch (level) {
    case "ok":
      return "All Good";
    case "heads_up":
      return "Heads Up";
    case "red_flag":
      return "Attention Needed";
    default:
      return "Not Assessed";
  }
};

/**
 * Calculate weekly average for trend analysis
 */
export const calculateWeeklyTrends = (entries: Record<string, AnalyzerEntry>): {
  avgWater: number;
  avgSleep: number;
  avgExercise: number;
  avgCaffeine: number;
  riskTrend: "improving" | "stable" | "concerning";
} => {
  const recentEntries = Object.values(entries)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7); // Last 7 days

  if (recentEntries.length === 0) {
    return {
      avgWater: 0,
      avgSleep: 0,
      avgExercise: 0,
      avgCaffeine: 0,
      riskTrend: "stable"
    };
  }

  const totals = recentEntries.reduce(
    (acc, entry) => ({
      water: acc.water + (entry.waterCups || 0),
      sleep: acc.sleep + (entry.sleepHours || 0),
      exercise: acc.exercise + (entry.exerciseMins || 0),
      caffeine: acc.caffeine + (entry.caffeineMg || 0),
      score: acc.score + (entry.score || 0)
    }),
    { water: 0, sleep: 0, exercise: 0, caffeine: 0, score: 0 }
  );

  const count = recentEntries.length;
  
  // Determine trend by comparing first half vs second half of week
  const firstHalf = recentEntries.slice(Math.floor(count / 2));
  const secondHalf = recentEntries.slice(0, Math.floor(count / 2));
  
  const firstHalfAvgScore = firstHalf.reduce((sum, entry) => sum + (entry.score || 0), 0) / firstHalf.length;
  const secondHalfAvgScore = secondHalf.reduce((sum, entry) => sum + (entry.score || 0), 0) / secondHalf.length;
  
  let riskTrend: "improving" | "stable" | "concerning";
  if (firstHalfAvgScore < secondHalfAvgScore - 1) {
    riskTrend = "improving";
  } else if (firstHalfAvgScore > secondHalfAvgScore + 1) {
    riskTrend = "concerning";
  } else {
    riskTrend = "stable";
  }

  return {
    avgWater: Math.round(totals.water / count),
    avgSleep: +(totals.sleep / count).toFixed(1),
    avgExercise: Math.round(totals.exercise / count),
    avgCaffeine: Math.round(totals.caffeine / count),
    riskTrend
  };
};