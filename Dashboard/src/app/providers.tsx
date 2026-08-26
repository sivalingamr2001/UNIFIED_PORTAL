import React from 'react';
import { ThemeProvider } from '../shared/lib/theme-provider';
import { AuthProvider } from '../features/auth/useAuth';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
