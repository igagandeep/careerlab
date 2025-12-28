'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SignInModal to prevent SSR issues
const SignInModal = dynamic(() => import('../components/SignInModal'), {
  ssr: false,
});

interface ModalContextType {
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <ModalContext.Provider value={{ openSignInModal, closeSignInModal }}>
      {children}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
      />
    </ModalContext.Provider>
  );
};