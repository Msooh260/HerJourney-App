/**
 * App-wide context for state management
 */

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AppStateV1, getState, setState } from '@/lib/storage';

interface AppContextType {
  state: AppStateV1;
  dispatch: React.Dispatch<AppAction>;
  updateUser: (updates: Partial<AppStateV1['user']>) => void;
  updateSettings: (updates: Partial<AppStateV1['settings']>) => void;
  enablePremium: () => void;
  isPregnant: boolean;
  isPremium: boolean;
}

type AppAction = 
  | { type: 'SET_STATE'; payload: AppStateV1 }
  | { type: 'UPDATE_USER'; payload: Partial<AppStateV1['user']> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppStateV1['settings']> }
  | { type: 'UPDATE_KEYS'; payload: Partial<AppStateV1['keys']> }
  | { type: 'ENABLE_PREMIUM'; }
  | { type: 'RESET_STATE'; };

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppStateV1, action: AppAction): AppStateV1 => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'UPDATE_KEYS':
      return {
        ...state,
        keys: { ...state.keys, ...action.payload }
      };
    case 'ENABLE_PREMIUM':
      return {
        ...state,
        user: { ...state.user, premiumActive: true }
      };
    case 'RESET_STATE':
      return getState(); // Get fresh default state
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, getState());

  // Persist state changes to localStorage
  useEffect(() => {
    setState(() => state);
  }, [state]);

  const updateUser = (updates: Partial<AppStateV1['user']>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const updateSettings = (updates: Partial<AppStateV1['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates });
  };

  const enablePremium = () => {
    dispatch({ type: 'ENABLE_PREMIUM' });
  };

  const value: AppContextType = {
    state,
    dispatch,
    updateUser,
    updateSettings,
    enablePremium,
    isPregnant: state.user.isPregnant,
    isPremium: state.user.premiumActive,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};