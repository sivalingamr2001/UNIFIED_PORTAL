import React from 'react';
import { ThemeProvider } from '../shared/lib/theme-provider';
import { DatabaseProvider } from '../shared/lib/database.context';
import { AuthProvider } from '../features/auth/useAuth';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
};
