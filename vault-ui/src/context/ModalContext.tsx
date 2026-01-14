import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface ModalState {
  id: string;
  component: ReactNode;
  props?: Record<string, unknown>;
}

interface ModalContextValue {
  modals: ModalState[];
  openModal: (id: string, component: ReactNode, props?: Record<string, unknown>) => void;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  isOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalState[]>([]);

  const openModal = useCallback((id: string, component: ReactNode, props?: Record<string, unknown>) => {
    setModals((prev) => {
      // Replace if already exists, otherwise add
      const exists = prev.some((m) => m.id === id);
      if (exists) {
        return prev.map((m) => (m.id === id ? { id, component, props } : m));
      }
      return [...prev, { id, component, props }];
    });
  }, []);

  const closeModal = useCallback((id?: string) => {
    if (id) {
      setModals((prev) => prev.filter((m) => m.id !== id));
    } else {
      // Close the last opened modal
      setModals((prev) => prev.slice(0, -1));
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const isOpen = useCallback(
    (id: string) => modals.some((m) => m.id === id),
    [modals]
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modals.length > 0) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modals.length, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modals.length]);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals, isOpen }}>
      {children}
      {/* Render modal stack */}
      {modals.map((modal) => (
        <div key={modal.id} className="modal-portal">
          {modal.component}
        </div>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}

// Helper hook for specific modal
export function useModalState(modalId: string) {
  const { openModal, closeModal, isOpen } = useModal();
  
  const open = useCallback(
    (component: ReactNode, props?: Record<string, unknown>) => {
      openModal(modalId, component, props);
    },
    [modalId, openModal]
  );

  const close = useCallback(() => {
    closeModal(modalId);
  }, [modalId, closeModal]);

  return {
    isOpen: isOpen(modalId),
    open,
    close,
  };
}
