import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role, Module, MenuItem, RoleModuleMapping, RoleMenuMapping, UserAccessRight, PortalMessage } from '../../types/domain';

interface DatabaseContextType {
  users: User[];
  roles: Role[];
  modules: Module[];
  menuItems: MenuItem[];
  roleModules: RoleModuleMapping[];
  roleMenus: RoleMenuMapping[];
  userAccessRights: UserAccessRight[];
  portalMessages: PortalMessage[];
  getMessage: (code: string) => string;
  updatePortalMessage: (msg: PortalMessage) => void;
  
  // CRUD User
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (code: string) => void;

  // CRUD Role
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (role: Role) => void;
  deleteRole: (code: string) => void;

  // CRUD Module
  addModule: (mod: Omit<Module, 'id'>) => void;
  updateModule: (mod: Module) => void;
  deleteModule: (code: string) => void;

  // CRUD Menu Item
  addMenuItem: (menuItem: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (menuItem: MenuItem) => void;
  deleteMenuItem: (code: string) => void;

  // Save Mappings
  saveRoleModules: (mappings: RoleModuleMapping[]) => void;
  saveRoleMenus: (mappings: RoleMenuMapping[]) => void;
  saveUserAccessRights: (rights: UserAccessRight[]) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Initial Data Setup
const initialUsers: User[] = [
  { id: 1, code: 'USR001', name: 'Rajalakshmi', login: 'rajalakshmi', email: 'rajalakshmi@janatics.com', mobile: '+91 98765 00001', role: 'Super Admin', type: 'Employee', sec: 99, reportsTo: '', validFrom: '2024-01-01', validTo: '2027-12-31', status: 'Active' },
  { id: 2, code: 'USR002', name: 'Govindaraj', login: 'govindaraj', email: 'govindaraj@janatics.com', mobile: '+91 98765 00002', role: 'Finance Admin', type: 'Employee', sec: 80, reportsTo: 'Rajalakshmi', validFrom: '2024-01-10', validTo: '2027-12-31', status: 'Active' },
  { id: 3, code: 'USR003', name: 'CKV', login: 'ckv', email: 'ckv@janatics.com', mobile: '+91 98765 00003', role: 'HR Admin', type: 'Employee', sec: 78, reportsTo: 'Rajalakshmi', validFrom: '2024-01-10', validTo: '2027-12-31', status: 'Active' },
  { id: 4, code: 'USR004', name: 'Raaman', login: 'raaman', email: 'raaman@janatics.com', mobile: '+91 98765 00004', role: 'Operations', type: 'Employee', sec: 72, reportsTo: 'Rajalakshmi', validFrom: '2024-02-01', validTo: '2027-12-31', status: 'Active' },
  { id: 5, code: 'USR005', name: 'Saranya', login: 'saranya', email: 'saranya@janatics.com', mobile: '+91 98765 00005', role: 'Viewer', type: 'Employee', sec: 50, reportsTo: 'Govindaraj', validFrom: '2024-03-01', validTo: '2026-12-31', status: 'Active' },
  { id: 6, code: 'USR006', name: 'Sindhu', login: 'sindhu', email: 'sindhu@janatics.com', mobile: '+91 98765 00006', role: 'Viewer', type: 'Employee', sec: 48, reportsTo: 'Govindaraj', validFrom: '2024-03-01', validTo: '2026-12-31', status: 'Active' },
  { id: 7, code: 'USR007', name: 'Sangeetha', login: 'sangeetha', email: 'sangeetha@janatics.com', mobile: '+91 98765 00007', role: 'Auditor', type: 'Employee', sec: 45, reportsTo: 'CKV', validFrom: '2024-03-15', validTo: '2026-12-31', status: 'Active' },
  { id: 8, code: 'USR008', name: 'Rahul', login: 'rahul', email: 'rahul@janatics.com', mobile: '+91 98765 00008', role: 'Viewer', type: 'Contract', sec: 10, reportsTo: 'CKV', validFrom: '2024-04-01', validTo: '2026-12-31', status: 'Inactive' },
  { id: 9, code: 'USR009', name: 'Sathish', login: 'sathish', email: 'sathish@janatics.com', mobile: '+91 98765 00009', role: 'Operations', type: 'Employee', sec: 68, reportsTo: 'Raaman', validFrom: '2024-02-15', validTo: '2027-12-31', status: 'Active' },
];

const initialRoles: Role[] = [
  { id: 1, code: 'ROL001', name: 'Super Admin', status: 'Active' },
  { id: 2, code: 'ROL002', name: 'Finance Admin', status: 'Active' },
  { id: 3, code: 'ROL003', name: 'HR Admin', status: 'Active' },
  { id: 4, code: 'ROL004', name: 'Operations', status: 'Active' },
  { id: 5, code: 'ROL005', name: 'Viewer', status: 'Active' },
  { id: 6, code: 'ROL006', name: 'Auditor', status: 'Active' },
];

const initialModules: Module[] = [
  { id: 1, code: 'MOD001', name: 'Admin', description: 'System administration & configuration', status: 'Active' },
  { id: 2, code: 'MOD002', name: 'PES', description: 'Planning Execution System', status: 'Active' },
  { id: 3, code: 'MOD003', name: 'PES Lite', description: 'Simplified planning execution', status: 'Active' },
  { id: 4, code: 'MOD004', name: 'DMS', description: 'Dealer Management System', status: 'Active' },
  { id: 5, code: 'MOD005', name: 'SCM', description: 'Supply Chain Management', status: 'Active' },
  { id: 6, code: 'MOD006', name: 'PMS', description: 'Performance Monitoring System', status: 'Active' },
  { id: 7, code: 'MOD007', name: 'MES', description: 'Manufacturing Execution System', status: 'Active' },
  { id: 8, code: 'MOD008', name: 'Finance', description: 'Financial Accounting & Reporting', status: 'Active' },
];

const initialMenuItems: MenuItem[] = [
  { id: 1, code: 'MNU001', menuName: 'Chart of Accounts', displayName: 'Chart of Accounts', module: 'Finance', parent: '—', type: 'Master', nature: 'Form', sort: 1, status: 'Active' },
  { id: 2, code: 'MNU002', menuName: 'Journal Entry', displayName: 'Journal Entry', module: 'Finance', parent: '—', type: 'Transaction', nature: 'Form', sort: 2, status: 'Active' },
  { id: 3, code: 'MNU003', menuName: 'Trial Balance', displayName: 'Trial Balance Report', module: 'Finance', parent: '—', type: 'Report', nature: 'Report', sort: 3, status: 'Active' },
  { id: 4, code: 'MNU004', menuName: 'Employee Master', displayName: 'Employee Master', module: 'Human Resources', parent: '—', type: 'Master', nature: 'Form', sort: 1, status: 'Active' },
  { id: 5, code: 'MNU005', menuName: 'Leave Application', displayName: 'Leave Application', module: 'Human Resources', parent: '—', type: 'Transaction', nature: 'Form', sort: 2, status: 'Active' },
  { id: 6, code: 'MNU006', menuName: 'Item Master', displayName: 'Item Master', module: 'Inventory', parent: '—', type: 'Master', nature: 'Form', sort: 1, status: 'Active' },
  { id: 7, code: 'MNU007', menuName: 'Stock Transfer', displayName: 'Stock Transfer', module: 'Inventory', parent: '—', type: 'Transaction', nature: 'Form', sort: 2, status: 'Active' },
  { id: 8, code: 'MNU008', menuName: 'Stock Ledger', displayName: 'Stock Ledger Report', module: 'Inventory', parent: '—', type: 'Report', nature: 'Report', sort: 3, status: 'Active' },
];

// Initial Mappings
const initialRoleModules: RoleModuleMapping[] = [
  { roleName: 'Super Admin', moduleName: 'Admin', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'PES', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'PES Lite', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'DMS', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'SCM', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'PMS', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'MES', hasAccess: true },
  { roleName: 'Super Admin', moduleName: 'Finance', hasAccess: true },
  { roleName: 'Finance Admin', moduleName: 'Finance', hasAccess: true },
  { roleName: 'Finance Admin', moduleName: 'SCM', hasAccess: true },
];

const initialRoleMenus: RoleMenuMapping[] = [
  { roleName: 'Super Admin', menuCode: 'MNU001', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU002', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU003', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU004', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU005', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU006', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU007', hasAccess: true },
  { roleName: 'Super Admin', menuCode: 'MNU008', hasAccess: true },
  { roleName: 'Finance Admin', menuCode: 'MNU001', hasAccess: true },
  { roleName: 'Finance Admin', menuCode: 'MNU002', hasAccess: true },
  { roleName: 'Finance Admin', menuCode: 'MNU003', hasAccess: true },
];

const initialUserAccessRights: UserAccessRight[] = [
  { username: 'rajalakshmi', moduleName: 'Admin', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { username: 'rajalakshmi', moduleName: 'PES', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { username: 'rajalakshmi', moduleName: 'Finance', canView: true, canCreate: true, canEdit: true, canDelete: true },
  { username: 'govindaraj', moduleName: 'Finance', canView: true, canCreate: true, canEdit: true, canDelete: false },
  { username: 'govindaraj', moduleName: 'SCM', canView: true, canCreate: false, canEdit: false, canDelete: false },
];

const initialPortalMessages: PortalMessage[] = [
  { id: 1, portalCode: 'User Master', portalText: 'User Master' },
  { id: 2, portalCode: 'Role Master', portalText: 'Role Master' },
  { id: 3, portalCode: 'Module Master', portalText: 'Module Master' },
  { id: 4, portalCode: 'Menu Master', portalText: 'Menu Master' },
  { id: 5, portalCode: 'Role-Module Mapping', portalText: 'Role-Module Mapping' },
  { id: 6, portalCode: 'Role-Menu Mapping', portalText: 'Role-Menu Mapping' },
  { id: 7, portalCode: 'User Access Overrides', portalText: 'User Access Overrides' },
  { id: 8, portalCode: 'User Hierarchy', portalText: 'User Hierarchy' },
  { id: 9, portalCode: 'Finance', portalText: 'Finance' },
  { id: 10, portalCode: 'SCM', portalText: 'SCM' },
  { id: 11, portalCode: 'MES', portalText: 'MES' },
  { id: 12, portalCode: 'PMS', portalText: 'PMS' },
  { id: 13, portalCode: 'DMS', portalText: 'DMS' },
  { id: 14, portalCode: 'PES', portalText: 'PES' },
  { id: 15, portalCode: 'PES Lite', portalText: 'PES Lite' },
];

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const local = localStorage.getItem('janatics_db_users');
    return local ? JSON.parse(local) : initialUsers;
  });

  const [roles, setRoles] = useState<Role[]>(() => {
    const local = localStorage.getItem('janatics_db_roles');
    return local ? JSON.parse(local) : initialRoles;
  });

  const [modules, setModules] = useState<Module[]>(() => {
    const local = localStorage.getItem('janatics_db_modules');
    return local ? JSON.parse(local) : initialModules;
  });

  const [portalMessages, setPortalMessages] = useState<PortalMessage[]>(() => {
    const local = localStorage.getItem('janatics_portal_messages');
    return local ? JSON.parse(local) : initialPortalMessages;
  });

  useEffect(() => {
    localStorage.setItem('janatics_portal_messages', JSON.stringify(portalMessages));
  }, [portalMessages]);

  const getMessage = (code: string): string => {
    const msg = portalMessages.find(m => m.portalCode.toLowerCase() === code.toLowerCase());
    return msg ? msg.portalText : code;
  };

  const updatePortalMessage = (updated: PortalMessage) => {
    setPortalMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const local = localStorage.getItem('janatics_db_menu_items');
    return local ? JSON.parse(local) : initialMenuItems;
  });

  const [roleModules, setRoleModules] = useState<RoleModuleMapping[]>(() => {
    const local = localStorage.getItem('janatics_db_role_modules');
    return local ? JSON.parse(local) : initialRoleModules;
  });

  const [roleMenus, setRoleMenus] = useState<RoleMenuMapping[]>(() => {
    const local = localStorage.getItem('janatics_db_role_menus');
    return local ? JSON.parse(local) : initialRoleMenus;
  });

  const [userAccessRights, setUserAccessRights] = useState<UserAccessRight[]>(() => {
    const local = localStorage.getItem('janatics_db_user_access_rights');
    return local ? JSON.parse(local) : initialUserAccessRights;
  });

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('janatics_db_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('janatics_db_roles', JSON.stringify(roles)); }, [roles]);
  useEffect(() => { localStorage.setItem('janatics_db_modules', JSON.stringify(modules)); }, [modules]);
  useEffect(() => { localStorage.setItem('janatics_db_menu_items', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('janatics_db_role_modules', JSON.stringify(roleModules)); }, [roleModules]);
  useEffect(() => { localStorage.setItem('janatics_db_role_menus', JSON.stringify(roleMenus)); }, [roleMenus]);
  useEffect(() => { localStorage.setItem('janatics_db_user_access_rights', JSON.stringify(userAccessRights)); }, [userAccessRights]);

  // CRUD - Users
  const addUser = (newUser: Omit<User, 'id'>) => {
    setUsers(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(u => u.id)) + 1 : 1;
      return [...prev, { ...newUser, id: nextId }];
    });
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (code: string) => {
    setUsers(prev => prev.filter(u => u.code !== code));
  };

  // CRUD - Roles
  const addRole = (newRole: Omit<Role, 'id'>) => {
    setRoles(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
      return [...prev, { ...newRole, id: nextId }];
    });
  };

  const updateRole = (updatedRole: Role) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const deleteRole = (code: string) => {
    setRoles(prev => prev.filter(r => r.code !== code));
  };

  // CRUD - Modules
  const addModule = (newMod: Omit<Module, 'id'>) => {
    setModules(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(m => m.id)) + 1 : 1;
      return [...prev, { ...newMod, id: nextId }];
    });
  };

  const updateModule = (updatedMod: Module) => {
    setModules(prev => prev.map(m => m.id === updatedMod.id ? updatedMod : m));
  };

  const deleteModule = (code: string) => {
    setModules(prev => prev.filter(m => m.code !== code));
  };

  // CRUD - Menu Items
  const addMenuItem = (newMenuItem: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(m => m.id)) + 1 : 1;
      return [...prev, { ...newMenuItem, id: nextId }];
    });
  };

  const updateMenuItem = (updatedMenuItem: MenuItem) => {
    setMenuItems(prev => prev.map(m => m.id === updatedMenuItem.id ? updatedMenuItem : m));
  };

  const deleteMenuItem = (code: string) => {
    setMenuItems(prev => prev.filter(m => m.code !== code));
  };

  // Save Mappings
  const saveRoleModules = (mappings: RoleModuleMapping[]) => {
    setRoleModules(mappings);
  };

  const saveRoleMenus = (mappings: RoleMenuMapping[]) => {
    setRoleMenus(mappings);
  };

  const saveUserAccessRights = (rights: UserAccessRight[]) => {
    setUserAccessRights(rights);
  };

  return (
    <DatabaseContext.Provider value={{
      users,
      roles,
      modules,
      menuItems,
      roleModules,
      roleMenus,
      userAccessRights,
      addUser,
      updateUser,
      deleteUser,
      addRole,
      updateRole,
      deleteRole,
      addModule,
      updateModule,
      deleteModule,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      saveRoleModules,
      saveRoleMenus,
      saveUserAccessRights,
      portalMessages,
      getMessage,
      updatePortalMessage
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};
