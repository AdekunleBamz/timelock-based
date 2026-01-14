import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';

// State types
export interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
  lastRefresh: number | null;
}

// Action types
export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'REFRESH' }
  | { type: 'RESET' };

// Initial state
const initialState: AppState = {
  theme: 'dark',
  sidebarOpen: true,
  isLoading: false,
  error: null,
  lastRefresh: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'REFRESH':
      return { ...state, lastRefresh: Date.now() };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context
interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

// Convenience hooks
export function useTheme() {
  const { state, dispatch } = useAppContext();
  
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  return { theme: state.theme, setTheme };
}

export function useSidebar() {
  const { state, dispatch } = useAppContext();
  
  const toggle = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
  const open = () => dispatch({ type: 'SET_SIDEBAR', payload: true });
  const close = () => dispatch({ type: 'SET_SIDEBAR', payload: false });
  
  return {
    isOpen: state.sidebarOpen,
    toggle,
    open,
    close,
  };
}

export function useAppLoading() {
  const { state, dispatch } = useAppContext();
  
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };
  
  return { isLoading: state.isLoading, setLoading };
}
