/**
 * Pregnancy calculations and utilities
 */

import { addDays, differenceInDays, parseISO, format } from 'date-fns';

export interface PregnancyData {
  gestationalWeeks: number;
  gestationalDays: number;
  dueDate?: Date;
  trimester: 1 | 2 | 3;
  weekProgress: number; // 0-100%
  dayInWeek: number; // 1-7
}

export interface PeriodData {
  nextPeriod?: Date;
  fertileWindowStart?: Date;
  fertileWindowEnd?: Date;
  daysUntilNextPeriod?: number;
  cycleProgress: number; // 0-100%
}

/**
 * Calculate pregnancy data from LMP or EDD
 */
export const calculatePregnancy = (
  lmp?: string,
  edd?: string,
  cycleLength: number = 28
): PregnancyData | null => {
  if (!lmp && !edd) return null;

  const today = new Date();
  let dueDate: Date;
  let gestationalDays: number;

  if (edd) {
    // Calculate from due date
    dueDate = parseISO(edd);
    gestationalDays = 280 - differenceInDays(dueDate, today);
  } else if (lmp) {
    // Calculate from LMP with cycle length adjustment
    const lmpDate = parseISO(lmp);
    const cycleLengthAdjustment = cycleLength - 28;
    dueDate = addDays(lmpDate, 280 + cycleLengthAdjustment);
    gestationalDays = differenceInDays(today, lmpDate);
  } else {
    return null;
  }

  // Clamp gestational days to valid range
  gestationalDays = Math.max(0, Math.min(gestationalDays, 280));
  
  const gestationalWeeks = Math.floor(gestationalDays / 7);
  const dayInWeek = (gestationalDays % 7) + 1;
  
  // Calculate trimester
  let trimester: 1 | 2 | 3;
  if (gestationalWeeks <= 13) trimester = 1;
  else if (gestationalWeeks <= 27) trimester = 2;
  else trimester = 3;

  // Calculate progress (0-100%)
  const weekProgress = Math.min(100, (gestationalWeeks / 40) * 100);

  return {
    gestationalWeeks: Math.min(gestationalWeeks, 40),
    gestationalDays,
    dueDate,
    trimester,
    weekProgress,
    dayInWeek,
  };
};

/**
 * Calculate period tracking data
 */
export const calculatePeriodData = (
  lastPeriodDate?: string,
  cycleLength: number = 28
): PeriodData => {
  if (!lastPeriodDate) {
    return { cycleProgress: 0 };
  }

  const today = new Date();
  const lastPeriod = parseISO(lastPeriodDate);
  const daysSinceLastPeriod = differenceInDays(today, lastPeriod);
  
  const nextPeriod = addDays(lastPeriod, cycleLength);
  const daysUntilNextPeriod = differenceInDays(nextPeriod, today);
  
  // Fertile window: typically 5 days before ovulation + ovulation day
  const ovulationDay = cycleLength - 14; // Approx 14 days before next period
  const fertileWindowStart = addDays(lastPeriod, ovulationDay - 5);
  const fertileWindowEnd = addDays(lastPeriod, ovulationDay + 1);
  
  // Cycle progress (0-100%)
  const cycleProgress = Math.min(100, (daysSinceLastPeriod / cycleLength) * 100);

  return {
    nextPeriod,
    fertileWindowStart,
    fertileWindowEnd,
    daysUntilNextPeriod,
    cycleProgress,
  };
};

/**
 * Get fruit/vegetable comparison for pregnancy week
 */
export const getFruitForWeek = (week: number): { name: string; description: string } => {
  // Map weeks 1-40 to fruits/vegetables with descriptions
  const fruitMap: Record<number, { name: string; description: string }> = {
    1: { name: "Poppy seed", description: "Just a tiny beginning" },
    2: { name: "Sesame seed", description: "Still microscopic" },
    3: { name: "Chia seed", description: "About to implant" },
    4: { name: "Raspberry", description: "Heart starts beating" },
    5: { name: "Peppercorn", description: "Brain development begins" },
    6: { name: "Lentil", description: "Limb buds appear" },
    7: { name: "Blueberry", description: "Double in size this week" },
    8: { name: "Kidney bean", description: "Fingers and toes forming" },
    9: { name: "Grape", description: "Heart fully formed" },
    10: { name: "Kumquat", description: "All vital organs present" },
    11: { name: "Fig", description: "Growing rapidly now" },
    12: { name: "Lime", description: "End of first trimester" },
    13: { name: "Peach", description: "Vocal cords developing" },
    14: { name: "Lemon", description: "Second trimester begins" },
    15: { name: "Apple", description: "Bones hardening" },
    16: { name: "Avocado", description: "Can hear your voice" },
    17: { name: "Turnip", description: "Fat accumulation starts" },
    18: { name: "Bell pepper", description: "Yawning and hiccupping" },
    19: { name: "Tomato", description: "Sensory development" },
    20: { name: "Banana", description: "Halfway there!" },
    21: { name: "Carrot", description: "Rapid brain growth" },
    22: { name: "Spaghetti squash", description: "Hearing improves" },
    23: { name: "Large mango", description: "Sense of movement" },
    24: { name: "Corn", description: "Viability milestone" },
    25: { name: "Rutabaga", description: "Hair growth" },
    26: { name: "Red onion", description: "Eyes can open" },
    27: { name: "Cauliflower", description: "Third trimester soon" },
    28: { name: "Eggplant", description: "Third trimester begins" },
    29: { name: "Butternut squash", description: "Bones hardening more" },
    30: { name: "Cabbage", description: "Strong kicks now" },
    31: { name: "Coconut", description: "Rapid weight gain" },
    32: { name: "Napa cabbage", description: "Practicing breathing" },
    33: { name: "Pineapple", description: "Immune system developing" },
    34: { name: "Cantaloupe", description: "Central nervous system" },
    35: { name: "Honeydew melon", description: "Kidneys fully developed" },
    36: { name: "Romaine lettuce", description: "Considered full-term soon" },
    37: { name: "Swiss chard", description: "Full-term!" },
    38: { name: "Leek", description: "Ready any day" },
    39: { name: "Mini watermelon", description: "Organs fully mature" },
    40: { name: "Small pumpkin", description: "Ready to meet you!" },
  };

  return fruitMap[week] || { name: "Little one", description: "Growing beautifully" };
};

/**
 * Get friendly week display text
 */
export const getWeekDisplayText = (pregnancy: PregnancyData): string => {
  if (pregnancy.gestationalWeeks === 0) {
    return `Day ${pregnancy.dayInWeek}`;
  }
  return `Week ${pregnancy.gestationalWeeks}, Day ${pregnancy.dayInWeek}`;
};

/**
 * Get trimester display text
 */
export const getTrimesterText = (trimester: 1 | 2 | 3): string => {
  const texts = {
    1: "First Trimester",
    2: "Second Trimester", 
    3: "Third Trimester"
  };
  return texts[trimester];
};

/**
 * Format due date for display
 */
export const formatDueDate = (dueDate: Date): string => {
  return format(dueDate, 'MMMM d, yyyy');
};

/**
 * Get days until due date
 */
export const getDaysUntilDue = (dueDate: Date): number => {
  return Math.max(0, differenceInDays(dueDate, new Date()));
};