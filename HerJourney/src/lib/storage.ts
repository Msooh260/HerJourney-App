/**
 * LocalStorage persistence with versioning and migrations
 * Core data structures for pregnancy tracking app
 */

export interface AppStateV1 {
  version: 1;
  user: {
    name?: string;
    email?: string;
    isPregnant: boolean;
    lmp?: string;            // ISO date - Last Menstrual Period
    edd?: string;            // ISO date - Estimated Due Date
    cycleLength?: number;    // days (default 28)
    premiumActive: boolean;
    emailSubscription?: boolean;
  };
  keys: {
    openaiApiKey?: string;
    mapboxToken?: string;
  };
  logs: {
    symptomsByDate: Record<string, string[]>; // e.g., { "2025-09-01": ["nausea","fatigue"] }
    analyzerByDate: Record<string, AnalyzerEntry>;
    periodLogs: string[]; // ISO dates of period starts
    notes: Note[];
    appointments: Appointment[];
  };
  settings: {
    units: "metric" | "imperial";
    theme: "light" | "dark" | "system";
  };
}

export interface AnalyzerEntry {
  date: string;
  waterCups?: number;
  caffeineMg?: number;
  alcoholDrinks?: number;
  smoked?: boolean;
  sleepHours?: number;
  exerciseMins?: number;
  prenatalVitamin?: boolean;
  bleeding?: boolean;
  fever?: boolean;
  severePain?: boolean;
  headachesVision?: boolean;
  swelling?: boolean;
  score?: number;     // computed risk score
  level?: "ok" | "heads_up" | "red_flag";
  messages?: string[];
}

export interface Note { 
  id: string; 
  date: string; 
  text: string; 
  tags?: string[]; 
  pinned?: boolean; 
}

export interface Appointment { 
  id: string; 
  title: string; 
  date: string; 
  notes?: string; 
}

const STORAGE_KEY = 'bloom.app.v1';

// Default state for new users
const getDefaultState = (): AppStateV1 => ({
  version: 1,
  user: {
    name: undefined,
    email: undefined,
    isPregnant: false,
    lmp: undefined,
    edd: undefined,
    cycleLength: 28,
    premiumActive: false,
    emailSubscription: false,
  },
  keys: {
    openaiApiKey: undefined,
    mapboxToken: undefined,
  },
  logs: {
    symptomsByDate: {},
    analyzerByDate: {},
    periodLogs: [],
    notes: [],
    appointments: [],
  },
  settings: {
    units: "metric",
    theme: "system",
  },
});

/**
 * Get current app state from localStorage
 */
export const getState = (): AppStateV1 => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultState();
    }

    const parsed = JSON.parse(stored);
    return migrateIfNeeded(parsed);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return getDefaultState();
  }
};

/**
 * Save app state to localStorage
 */
export const setState = (updater: (current: AppStateV1) => AppStateV1): void => {
  try {
    const currentState = getState();
    const newState = updater(currentState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

/**
 * Handle version migrations
 */
const migrateIfNeeded = (state: any): AppStateV1 => {
  if (!state.version || state.version < 1) {
    // If no version or old version, return default state
    return getDefaultState();
  }

  // Future migrations would go here
  return state as AppStateV1;
};

/**
 * Reset all data - useful for development and user data reset
 */
export const resetAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset data:', error);
  }
};

/**
 * Delete user account - removes all personal data
 */
export const deleteAccount = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete account:', error);
  }
};

/**
 * Helper functions for specific data operations
 */

// User profile helpers
export const updateUser = (updates: Partial<AppStateV1['user']>): void => {
  setState(state => ({
    ...state,
    user: { ...state.user, ...updates }
  }));
};

// Premium helpers
export const enablePremium = (): void => {
  updateUser({ premiumActive: true });
};

export const disablePremium = (): void => {
  updateUser({ premiumActive: false });
};

// API keys helpers
export const updateApiKeys = (keys: Partial<AppStateV1['keys']>): void => {
  setState(state => ({
    ...state,
    keys: { ...state.keys, ...keys }
  }));
};

// Analyzer logs helpers
export const saveAnalyzerEntry = (entry: AnalyzerEntry): void => {
  setState(state => ({
    ...state,
    logs: {
      ...state.logs,
      analyzerByDate: {
        ...state.logs.analyzerByDate,
        [entry.date]: entry
      }
    }
  }));
};

// Notes helpers
export const addNote = (note: Omit<Note, 'id'>): void => {
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
  };
  
  setState(state => ({
    ...state,
    logs: {
      ...state.logs,
      notes: [...state.logs.notes, newNote]
    }
  }));
};

export const updateNote = (id: string, updates: Partial<Note>): void => {
  setState(state => ({
    ...state,
    logs: {
      ...state.logs,
      notes: state.logs.notes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    }
  }));
};

export const deleteNote = (id: string): void => {
  setState(state => ({
    ...state,
    logs: {
      ...state.logs,
      notes: state.logs.notes.filter(note => note.id !== id)
    }
  }));
};

// Appointments helpers
export const addAppointment = (appointment: Omit<Appointment, 'id'>): void => {
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
  };
  
  setState(state => ({
    ...state,
    logs: {
      ...state.logs,
      appointments: [...state.logs.appointments, newAppointment]
    }
  }));
};

// Symptoms tracking helpers
export const saveSymptoms = (date: string, symptoms: string[]): void => {
  setState(state => ({
    ...state,
    logs: {
      ...state.logs,
      symptomsByDate: {
        ...state.logs.symptomsByDate,
        [date]: symptoms
      }
    }
  }));
};

export const getSymptomHistory = (): Array<{ date: string; symptoms: string[] }> => {
  const state = getState();
  return Object.entries(state.logs.symptomsByDate)
    .map(([date, symptoms]) => ({ date, symptoms }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};