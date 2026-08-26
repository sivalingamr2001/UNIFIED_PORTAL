import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../../types/domain';
import { authApi, usersApi, userAccessRightsApi, roleMenuApi } from '../../api/endpoints';
import { tokenStore } from '../../api/tokenStore';
import type { UserAccessRightsModel, RoleMenuModel } from '../../types/models';

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
  const [userAccessRights, setUserAccessRights] = useState<UserAccessRightsModel[]>([]);
  const [roleMenus, setRoleMenus] = useState<RoleMenuModel[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('janatics_auth_user');
    const token = tokenStore.get();
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('janatics_auth_user');
        tokenStore.clear();
      }
    }
    setLoading(false);
  }, []);

  // Fetch permissions when user changes
  useEffect(() => {
    if (!user) {
      setUserAccessRights([]);
      setRoleMenus([]);
      return;
    }

    const fetchPermissions = async () => {
      try {
        const [rights, roleMenuItems] = await Promise.all([
          userAccessRightsApi.getByUser(user.id).catch(() => [] as UserAccessRightsModel[]),
          roleMenuApi.list().catch(() => [] as RoleMenuModel[])
        ]);
        
        const rightsArray = Array.isArray(rights) ? rights : (rights ? [rights] : []);
        setUserAccessRights(rightsArray);
        setRoleMenus(roleMenuItems);
      } catch (err) {
        console.error("Error loading user permissions:", err);
      }
    };

    fetchPermissions();
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(username, password);
      if (response && response.token) {
        tokenStore.set(response.token, true);
        
        let loggedInUser: User | null = null;
        
        if (response.user) {
          const u = response.user;
          loggedInUser = {
            id: u.userId || 0,
            code: u.userCode || '',
            name: u.fullName || '',
            login: u.userName || '',
            email: u.primaryEmail || '',
            mobile: u.primaryMobile || '',
            role: u.roleName || 'Viewer',
            type: u.userType || 'Employee',
            sec: u.securityLevel || 50,
            reportsTo: u.reportsToName || '',
            validFrom: u.validFrom ? u.validFrom.split('T')[0] : '',
            validTo: u.validTo ? u.validTo.split('T')[0] : '',
            status: u.status === 'Inactive' ? 'Inactive' : 'Active'
          };
        } else {
          // Fallback: fetch users list and find matching username
          const usersList = await usersApi.list();
          const u = usersList.find(usr => usr.userName.toLowerCase() === username.toLowerCase());
          if (u) {
            loggedInUser = {
              id: u.userId || 0,
              code: u.userCode || '',
              name: u.fullName || '',
              login: u.userName || '',
              email: u.primaryEmail || '',
              mobile: u.primaryMobile || '',
              role: u.roleName || 'Viewer',
              type: u.userType || 'Employee',
              sec: u.securityLevel || 50,
              reportsTo: u.reportsToName || '',
              validFrom: u.validFrom ? u.validFrom.split('T')[0] : '',
              validTo: u.validTo ? u.validTo.split('T')[0] : '',
              status: u.status === 'Inactive' ? 'Inactive' : 'Active'
            };
          } else {
            // Default user details from response metadata or inputs
            loggedInUser = {
              id: response.userId || 1,
              code: 'USR001',
              name: response.fullName || response.userName || username,
              login: response.userName || username,
              email: `${response.userName || username}@janatics.com`,
              mobile: '',
              role: response.roleName || 'Viewer',
              type: 'Employee',
              sec: 50,
              reportsTo: '',
              validFrom: new Date().toISOString().split('T')[0],
              validTo: '',
              status: 'Active'
            };
          }
        }
        
        if (loggedInUser) {
          setUser(loggedInUser);
          localStorage.setItem('janatics_auth_user', JSON.stringify(loggedInUser));
          return true;
        }
      }
      throw new Error('Invalid authentication response');
    } catch (err: any) {
      throw new Error(err.message || 'Invalid username or password');
    }
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    setUser(null);
    tokenStore.clear();
    localStorage.removeItem('janatics_auth_user');
  };

  const isPermittedModule = (moduleName: string): boolean => {
    if (!user) return false;
    
    // Super Admin role has access to everything
    if (user.role === 'Super Admin') return true;

    // Check specific user access rights matrix override (remarks JSON payload)
    const specificRight = userAccessRights.find(r => {
      if (r.remarks) {
        try {
          const parsed = JSON.parse(r.remarks);
          if (Array.isArray(parsed)) {
            const found = parsed.find(
              (item: any) => item.moduleName.toLowerCase() === moduleName.toLowerCase()
            );
            if (found) return found.canView;
          }
        } catch (e) {
          // ignore parsing error
        }
      }
      return false;
    });

    if (specificRight) {
      return true;
    }

    // Check role-based menu mappings to see if role has mapping to this module
    const hasRoleMenuAccess = roleMenus.some(
      rm => rm.roleName?.toLowerCase() === user.role.toLowerCase() &&
            rm.moduleName?.toLowerCase() === moduleName.toLowerCase()
    );

    return hasRoleMenuAccess;
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
