import React from 'react';
import { ThemeProvider } from '../shared/lib/theme-provider';
import { AuthProvider } from '../features/auth/useAuth';
import { ConfirmProvider } from '../components/ConfirmDialog';
import { ToastProvider } from '../components/Toast';
import { Toaster } from '../shared/components/ui/sonner';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

