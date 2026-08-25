import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role, Module, MenuItem, RoleModuleMapping, RoleMenuMapping, UserAccessRight, PortalMessage } from '../../types/domain';
import { api } from '../../api/axiosClient';

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
  isInitialLoadDone: boolean;
  
  // CRUD User
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (code: string) => Promise<void>;

  // CRUD Role
  addRole: (role: Omit<Role, 'id'>) => Promise<void>;
  updateRole: (role: Role) => Promise<void>;
  deleteRole: (code: string) => Promise<void>;

  // CRUD Module
  addModule: (mod: Omit<Module, 'id'>) => Promise<void>;
  updateModule: (mod: Module) => Promise<void>;
  deleteModule: (code: string) => Promise<void>;

  // CRUD Menu Item
  addMenuItem: (menuItem: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (menuItem: MenuItem) => Promise<void>;
  deleteMenuItem: (code: string) => Promise<void>;

  // Save Mappings
  saveRoleModules: (mappings: RoleModuleMapping[]) => Promise<void>;
  saveRoleMenus: (mappings: RoleMenuMapping[]) => Promise<void>;
  saveUserAccessRights: (rights: UserAccessRight[]) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Initial Data Setup (Fallbacks in case server APIs are empty or offline)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [roleModules, setRoleModules] = useState<RoleModuleMapping[]>([]);
  const [roleMenus, setRoleMenus] = useState<RoleMenuMapping[]>([]);
  const [userAccessRights, setUserAccessRights] = useState<UserAccessRight[]>([]);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  const [portalMessages, setPortalMessages] = useState<PortalMessage[]>(() => {
    const local = localStorage.getItem('janatics_portal_messages');
    return local ? JSON.parse(local) : [];
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

  // Load state from backend APIs on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, rolesRes, modulesRes, menusRes, roleMenusRes, uarRes] = await Promise.all([
          api.users.getAll().catch(e => { console.error("Error fetching users:", e); return { data: [] }; }),
          api.roles.getAll().catch(e => { console.error("Error fetching roles:", e); return { data: [] }; }),
          api.modules.getAll().catch(e => { console.error("Error fetching modules:", e); return { data: [] }; }),
          api.menus.getAll().catch(e => { console.error("Error fetching menus:", e); return { data: [] }; }),
          api.roleMenu.getAll().catch(e => { console.error("Error fetching role-menus:", e); return { data: [] }; }),
          api.userAccessRights.getAll().catch(e => { console.error("Error fetching user access rights:", e); return { data: [] }; })
        ]);

        // Map Modules
        let mappedModules: Module[] = [];
        if (modulesRes.data && modulesRes.data.length > 0) {
          mappedModules = modulesRes.data.map((m: any) => ({
            id: m.moduleId || 0,
            code: m.moduleCode || '',
            name: m.moduleName || '',
            description: m.remarks || '',
            status: m.status === 'Inactive' ? 'Inactive' : 'Active'
          }));
        } else {
          mappedModules = [];
        }

        // Map Roles
        let mappedRoles: Role[] = [];
        if (rolesRes.data && rolesRes.data.length > 0) {
          mappedRoles = rolesRes.data.map((r: any) => ({
            id: r.roleId || 0,
            code: r.roleCode || '',
            name: r.roleName || '',
            status: r.status === 'Inactive' ? 'Inactive' : 'Active'
          }));
        } else {
          mappedRoles = [];
        }

        // Map Users
        let mappedUsers: User[] = [];
        if (usersRes.data && usersRes.data.length > 0) {
          mappedUsers = usersRes.data.map((u: any) => ({
            id: u.userId || 0,
            code: u.userCode || '',
            name: u.fullName || '',
            login: u.userName || '',
            email: u.primaryEmail || '',
            mobile: u.primaryMobile || '',
            role: u.roleName || '',
            type: u.userType || 'Employee',
            sec: u.securityLevel || 50,
            reportsTo: u.reportsToName || '',
            validFrom: u.validFrom ? u.validFrom.split('T')[0] : '',
            validTo: u.validTo ? u.validTo.split('T')[0] : '',
            status: u.status === 'Inactive' ? 'Inactive' : 'Active'
          }));
        } else {
          mappedUsers = [];
        }

        // Map Menus
        let mappedMenuItems: MenuItem[] = [];
        if (menusRes.data && menusRes.data.length > 0) {
          mappedMenuItems = menusRes.data.map((m: any) => {
            const parentMenu = menusRes.data.find((pm: any) => pm.menuId === m.parentMenuId);
            const parentName = parentMenu ? (parentMenu.menuName || '—') : '—';
            return {
              id: m.menuId || 0,
              code: m.menuCode || '',
              menuName: m.menuName || '',
              displayName: m.displayName || '',
              module: m.moduleName || '',
              parent: parentName,
              type: m.menuType || 'Master',
              nature: m.nature || 'Form',
              sort: m.sortOrder || 1,
              status: m.status === 'Inactive' ? 'Inactive' : 'Active'
            };
          });
        } else {
          mappedMenuItems = [];
        }

        // Map Role Menus
        let mappedRoleMenus: RoleMenuMapping[] = [];
        if (roleMenusRes.data && roleMenusRes.data.length > 0) {
          mappedRoleMenus = roleMenusRes.data.map((rm: any) => {
            const menu = mappedMenuItems.find(m => m.id === rm.menuId);
            return {
              roleName: rm.roleName || '',
              menuCode: menu ? menu.code : '',
              hasAccess: true
            };
          }).filter(rm => rm.menuCode !== '');
        } else {
          mappedRoleMenus = [];
        }

        // Map Role Modules
        const derivedRoleModules: RoleModuleMapping[] = [];
        mappedRoles.forEach(r => {
          mappedModules.forEach(m => {
            const hasMenuAccess = roleMenusRes.data?.some((rm: any) => 
              rm.roleName?.toLowerCase() === r.name.toLowerCase() &&
              rm.moduleName?.toLowerCase() === m.name.toLowerCase()
            );
            derivedRoleModules.push({
              roleName: r.name,
              moduleName: m.name,
              hasAccess: r.name === 'Super Admin' || !!hasMenuAccess
            });
          });
        });

        // Map User Access Rights (overrides)
        let mappedUserAccessRights: UserAccessRight[] = [];
        if (uarRes.data && uarRes.data.length > 0) {
          uarRes.data.forEach((uar: any) => {
            if (uar.remarks) {
              try {
                const parsed = JSON.parse(uar.remarks);
                if (Array.isArray(parsed)) {
                  mappedUserAccessRights.push(...parsed);
                }
              } catch (e) {
                // ignore
              }
            }
          });
        }


        setModules(mappedModules);
        setRoles(mappedRoles);
        setUsers(mappedUsers);
        setMenuItems(mappedMenuItems);
        setRoleMenus(mappedRoleMenus);
        setRoleModules(derivedRoleModules);
        setUserAccessRights(mappedUserAccessRights);
      } catch (err) {
        console.error("Error loading initial data from API:", err);
      } finally {
        setIsInitialLoadDone(true);
      }
    };

    loadData();
  }, []);

  // CRUD - Users
  const addUser = async (newUser: Omit<User, 'id'>) => {
    try {
      const roleId = roles.find(r => r.name.toLowerCase() === newUser.role.toLowerCase())?.id;
      const reportingToUser = users.find(u => u.name.toLowerCase() === newUser.reportsTo.toLowerCase());
      const payload = {
        userCode: newUser.code,
        fullName: newUser.name,
        userName: newUser.login,
        primaryEmail: newUser.email,
        primaryMobile: newUser.mobile,
        roleId: roleId || undefined,
        roleName: newUser.role,
        userType: newUser.type,
        securityLevel: newUser.sec,
        reportingTo: reportingToUser?.id || undefined,
        reportsToName: newUser.reportsTo || undefined,
        validFrom: newUser.validFrom,
        validTo: newUser.validTo || undefined,
        status: newUser.status,
        password: "Password123!"
      };
      const res = await api.users.create(payload);
      const createdId = res.data?.userId || (users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1);
      setUsers(prev => [...prev, { ...newUser, id: createdId }]);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const roleId = roles.find(r => r.name.toLowerCase() === updatedUser.role.toLowerCase())?.id;
      const reportingToUser = users.find(u => u.name.toLowerCase() === updatedUser.reportsTo.toLowerCase());
      const payload = {
        userId: updatedUser.id,
        userCode: updatedUser.code,
        fullName: updatedUser.name,
        userName: updatedUser.login,
        primaryEmail: updatedUser.email,
        primaryMobile: updatedUser.mobile,
        roleId: roleId || undefined,
        roleName: updatedUser.role,
        userType: updatedUser.type,
        securityLevel: updatedUser.sec,
        reportingTo: reportingToUser?.id || undefined,
        reportsToName: updatedUser.reportsTo || undefined,
        validFrom: updatedUser.validFrom,
        validTo: updatedUser.validTo || undefined,
        status: updatedUser.status
      };
      await api.users.update(updatedUser.id, payload);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const deleteUser = async (code: string) => {
    try {
      const targetUser = users.find(u => u.code.toLowerCase() === code.toLowerCase());
      if (targetUser) {
        await api.users.remove(targetUser.id);
        setUsers(prev => prev.filter(u => u.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // CRUD - Roles
  const addRole = async (newRole: Omit<Role, 'id'>) => {
    try {
      const payload = {
        roleCode: newRole.code,
        roleName: newRole.name,
        status: newRole.status
      };
      const res = await api.roles.create(payload);
      const createdId = res.data?.roleId || (roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1);
      setRoles(prev => [...prev, { ...newRole, id: createdId }]);
    } catch (err) {
      console.error("Failed to add role:", err);
    }
  };

  const updateRole = async (updatedRole: Role) => {
    try {
      const payload = {
        roleId: updatedRole.id,
        roleCode: updatedRole.code,
        roleName: updatedRole.name,
        status: updatedRole.status
      };
      await api.roles.update(updatedRole.id, payload);
      setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const deleteRole = async (code: string) => {
    try {
      const targetRole = roles.find(r => r.code.toLowerCase() === code.toLowerCase());
      if (targetRole) {
        await api.roles.remove(targetRole.id);
        setRoles(prev => prev.filter(r => r.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete role:", err);
    }
  };

  // CRUD - Modules
  const addModule = async (newMod: Omit<Module, 'id'>) => {
    try {
      const payload = {
        moduleCode: newMod.code,
        moduleName: newMod.name,
        remarks: newMod.description,
        status: newMod.status
      };
      const res = await api.modules.create(payload);
      const createdId = res.data?.moduleId || (modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1);
      setModules(prev => [...prev, { ...newMod, id: createdId }]);
    } catch (err) {
      console.error("Failed to add module:", err);
    }
  };

  const updateModule = async (updatedMod: Module) => {
    try {
      const payload = {
        moduleId: updatedMod.id,
        moduleCode: updatedMod.code,
        moduleName: updatedMod.name,
        remarks: updatedMod.description,
        status: updatedMod.status
      };
      await api.modules.update(updatedMod.id, payload);
      setModules(prev => prev.map(m => m.id === updatedMod.id ? updatedMod : m));
    } catch (err) {
      console.error("Failed to update module:", err);
    }
  };

  const deleteModule = async (code: string) => {
    try {
      const targetMod = modules.find(m => m.code.toLowerCase() === code.toLowerCase());
      if (targetMod) {
        await api.modules.remove(targetMod.id);
        setModules(prev => prev.filter(m => m.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete module:", err);
    }
  };

  // CRUD - Menu Items
  const addMenuItem = async (newMenuItem: Omit<MenuItem, 'id'>) => {
    try {
      const moduleId = modules.find(m => m.name.toLowerCase() === newMenuItem.module.toLowerCase())?.id;
      const parentMenu = menuItems.find(mi => mi.menuName.toLowerCase() === newMenuItem.parent.toLowerCase());
      const payload = {
        menuCode: newMenuItem.code,
        menuName: newMenuItem.menuName,
        displayName: newMenuItem.displayName,
        moduleId: moduleId || undefined,
        moduleName: newMenuItem.module,
        parentMenuId: parentMenu?.id || undefined,
        menuType: newMenuItem.type,
        nature: newMenuItem.nature,
        sortOrder: newMenuItem.sort,
        status: newMenuItem.status
      };
      const res = await api.menus.create(payload);
      const createdId = res.data?.menuId || (menuItems.length > 0 ? Math.max(...menuItems.map(m => m.id)) + 1 : 1);
      setMenuItems(prev => [...prev, { ...newMenuItem, id: createdId }]);
    } catch (err) {
      console.error("Failed to add menu item:", err);
    }
  };

  const updateMenuItem = async (updatedMenuItem: MenuItem) => {
    try {
      const moduleId = modules.find(m => m.name.toLowerCase() === updatedMenuItem.module.toLowerCase())?.id;
      const parentMenu = menuItems.find(mi => mi.menuName.toLowerCase() === updatedMenuItem.parent.toLowerCase());
      const payload = {
        menuId: updatedMenuItem.id,
        menuCode: updatedMenuItem.code,
        menuName: updatedMenuItem.menuName,
        displayName: updatedMenuItem.displayName,
        moduleId: moduleId || undefined,
        moduleName: updatedMenuItem.module,
        parentMenuId: parentMenu?.id || undefined,
        menuType: updatedMenuItem.type,
        nature: updatedMenuItem.nature,
        sortOrder: updatedMenuItem.sort,
        status: updatedMenuItem.status
      };
      await api.menus.update(updatedMenuItem.id, payload);
      setMenuItems(prev => prev.map(m => m.id === updatedMenuItem.id ? updatedMenuItem : m));
    } catch (err) {
      console.error("Failed to update menu item:", err);
    }
  };

  const deleteMenuItem = async (code: string) => {
    try {
      const targetMenu = menuItems.find(m => m.code.toLowerCase() === code.toLowerCase());
      if (targetMenu) {
        await api.menus.remove(targetMenu.id);
        setMenuItems(prev => prev.filter(m => m.code !== code));
      }
    } catch (err) {
      console.error("Failed to delete menu item:", err);
    }
  };

  // Save Mappings
  const saveRoleModules = async (mappings: RoleModuleMapping[]) => {
    for (const mapping of mappings) {
      const oldMapping = roleModules.find(
        rm => rm.roleName.toLowerCase() === mapping.roleName.toLowerCase() &&
              rm.moduleName.toLowerCase() === mapping.moduleName.toLowerCase()
      );
      if (oldMapping && oldMapping.hasAccess !== mapping.hasAccess) {
        if (!mapping.hasAccess) {
          const roleId = roles.find(r => r.name.toLowerCase() === mapping.roleName.toLowerCase())?.id;
          if (roleId) {
            try {
              const currentMappingsRes = await api.roleMenu.getByRole(roleId);
              const toDelete = currentMappingsRes.data.filter(
                rm => rm.moduleName?.toLowerCase() === mapping.moduleName.toLowerCase()
              );
              for (const item of toDelete) {
                if (item.roleMenuId) {
                  await api.roleMenu.remove(item.roleMenuId);
                }
              }
            } catch (err) {
              console.error("Failed to delete role-module mappings:", err);
            }
          }
        } else {
          const roleId = roles.find(r => r.name.toLowerCase() === mapping.roleName.toLowerCase())?.id;
          const moduleId = modules.find(m => m.name.toLowerCase() === mapping.moduleName.toLowerCase())?.id;
          const firstMenu = menuItems.find(mi => mi.module.toLowerCase() === mapping.moduleName.toLowerCase());
          if (roleId && moduleId && firstMenu) {
            try {
              await api.roleMenu.create({
                roleId,
                moduleId,
                menuId: firstMenu.id,
                permView: 'Y',
                permAdd: 'Y',
                permEdit: 'Y',
                permDelete: 'Y'
              });
            } catch (err) {
              console.error("Failed to create default role-module mapping:", err);
            }
          }
        }
      }
    }
    setRoleModules(mappings);
  };

  const saveRoleMenus = async (mappings: RoleMenuMapping[]) => {
    for (const mapping of mappings) {
      const oldMapping = roleMenus.find(
        rm => rm.roleName.toLowerCase() === mapping.roleName.toLowerCase() &&
              rm.menuCode.toLowerCase() === mapping.menuCode.toLowerCase()
      );
      const wasAccess = oldMapping ? oldMapping.hasAccess : false;
      if (wasAccess !== mapping.hasAccess) {
        const role = roles.find(r => r.name.toLowerCase() === mapping.roleName.toLowerCase());
        const menu = menuItems.find(m => m.code.toLowerCase() === mapping.menuCode.toLowerCase());
        const moduleItem = menu ? modules.find(mod => mod.name.toLowerCase() === menu.module.toLowerCase()) : null;

        if (role && menu && moduleItem) {
          if (mapping.hasAccess) {
            try {
              await api.roleMenu.create({
                roleId: role.id,
                moduleId: moduleItem.id,
                menuId: menu.id,
                permView: 'Y',
                permAdd: 'Y',
                permEdit: 'Y',
                permDelete: 'Y'
              });
            } catch (err) {
              console.error("Failed to create role-menu mapping:", err);
            }
          } else {
            try {
              const currentMappingsRes = await api.roleMenu.getByRole(role.id);
              const targetRecord = currentMappingsRes.data.find(
                rm => rm.menuId === menu.id
              );
              if (targetRecord && targetRecord.roleMenuId) {
                await api.roleMenu.remove(targetRecord.roleMenuId);
              }
            } catch (err) {
              console.error("Failed to delete role-menu mapping:", err);
            }
          }
        }
      }
    }
    setRoleMenus(mappings);
  };

  const saveUserAccessRights = async (rights: UserAccessRight[]) => {
    const usernames = Array.from(new Set(rights.map(r => r.username.toLowerCase())));
    for (const username of usernames) {
      const user = users.find(u => u.login.toLowerCase() === username);
      if (user) {
        const userRights = rights.filter(r => r.username.toLowerCase() === username);
        try {
          await api.userAccessRights.removeByUser(user.id);
          await api.userAccessRights.create({
            userId: user.id,
            userName: user.login,
            remarks: JSON.stringify(userRights),
            status: 'Active'
          });
        } catch (err) {
          console.error(`Failed to save access rights for user ${username}:`, err);
        }
      }
    }
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
      updatePortalMessage,
      isInitialLoadDone
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
