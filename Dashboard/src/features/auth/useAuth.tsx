import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../../types/domain';
import { useDatabase } from '../../shared/hooks/useDatabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isPermittedModule: (moduleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, userAccessRights, roleModules, isInitialLoadDone } = useDatabase();

  useEffect(() => {
    if (!isInitialLoadDone) return;

    const savedUser = localStorage.getItem('janatics_auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Re-verify the user still exists in the user database list
        const exists = users.find(u => u.login === parsed.login && u.status === 'Active');
        if (exists) {
          setUser(exists);
        } else {
          localStorage.removeItem('janatics_auth_user');
        }
      } catch (e) {
        localStorage.removeItem('janatics_auth_user');
      }
    }
    setLoading(false);
  }, [isInitialLoadDone, users]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple demo validation rule:
    // admin / admin -> Administrator (Super Admin)
    // skyfast / skyfast -> Govindaraj (Finance Admin, USR002)
    // Or check any valid username from user list where password matches username for demo
    
    let matchedUser: User | undefined;
    
    if (username.toLowerCase() === 'admin' && password === 'admin') {
      matchedUser = users.find(u => u.login === 'rajalakshmi' && u.status === 'Active');
    } else if (username.toLowerCase() === 'skyfast' && password === 'skyfast') {
      matchedUser = users.find(u => u.login === 'govindaraj' && u.status === 'Active');
    } else if (password === username) {
      // Allow any active user to login with password identical to username
      matchedUser = users.find(u => u.login === username.toLowerCase() && u.status === 'Active');
    }

    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem('janatics_auth_user', JSON.stringify(matchedUser));
      return true;
    }
    
    throw new Error('Invalid username or password');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('janatics_auth_user');
  };

  const isPermittedModule = (moduleName: string): boolean => {
    if (!user) return false;
    
    // Super Admin role has access to everything
    if (user.role === 'Super Admin') return true;

    // Check specific user access rights matrix
    const specificRight = userAccessRights.find(
      r => r.username.toLowerCase() === user.login.toLowerCase() && 
      r.moduleName.toLowerCase() === moduleName.toLowerCase()
    );
    if (specificRight) {
      return specificRight.canView;
    }

    // Check role-based module mapping
    const roleMap = roleModules.find(
      rm => rm.roleName.toLowerCase() === user.role.toLowerCase() && 
      rm.moduleName.toLowerCase() === moduleName.toLowerCase()
    );
    if (roleMap) {
      return roleMap.hasAccess;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isPermittedModule }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default useAuth;
