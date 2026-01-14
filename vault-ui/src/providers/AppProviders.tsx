import type { ReactNode } from 'react';
import { ToastProvider } from '../context/ToastContext';
import { ModalProvider } from '../context/ModalContext';
import { AppProvider } from '../context/AppContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Centralized provider wrapper for the entire application.
 * Combines all context providers in the correct order.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
