import React, { useState, useEffect } from 'react';
import { rolesApi, modulesApi, menusApi, roleMenuApi } from '../../../api/endpoints';
import type { RoleModel, ModuleModel, RoleMenuModel } from '../../../types/models';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { ShieldAlert } from 'lucide-react';

export const RoleModulePage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [modules, setModules] = useState<ModuleModel[]>([]);
  const [roleMenus, setRoleMenus] = useState<RoleMenuModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [rolesList, modulesList, roleMenusList] = await Promise.all([
        rolesApi.list(),
        modulesApi.list(),
        roleMenuApi.list()
      ]);
      setRoles(rolesList);
      setModules(modulesList);
      setRoleMenus(roleMenusList);
    } catch (err) {
      console.error("Failed to load mapping data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const checkHasAccess = (roleName: string, moduleName: string): boolean => {
    if (roleName === 'Super Admin') return true;

    return roleMenus.some(
      rm => rm.roleName?.toLowerCase() === roleName.toLowerCase() && 
            rm.moduleName?.toLowerCase() === moduleName.toLowerCase()
    );
  };

  const handleToggleAccess = async (roleName: string, moduleName: string) => {
    // Cannot toggle Admin module for Super Admin (must always remain true)
    if (roleName === 'Super Admin' && moduleName === 'Admin') {
      alert('Super Admin must always have access to the Admin module.');
      return;
    }

    setLoading(true);
    try {
      const role = roles.find(r => r.roleName.toLowerCase() === roleName.toLowerCase());
      const mod = modules.find(m => m.name.toLowerCase() === moduleName.toLowerCase());
      if (!role || !mod) return;

      const hasAccess = checkHasAccess(roleName, moduleName);

      if (hasAccess) {
        // Turn access OFF: delete all menu mappings for this role in this module
        const currentMappings = await roleMenuApi.listByRole(role.roleId);
        const toDelete = currentMappings.filter(
          rm => rm.moduleName?.toLowerCase() === moduleName.toLowerCase()
        );
        for (const item of toDelete) {
          if (item.roleMenuId) {
            await roleMenuApi.remove(item.roleMenuId);
          }
        }
      } else {
        // Turn access ON: associate the role with the first available menu item in that module
        const allMenus = await menusApi.list();
        const firstMenu = allMenus.find(m => m.moduleName?.toLowerCase() === moduleName.toLowerCase());
        if (firstMenu) {
          await roleMenuApi.save({
            roleId: role.roleId,
            moduleId: mod.id,
            menuId: firstMenu.id,
            permView: 'Y',
            permAdd: 'Y',
            permEdit: 'Y',
            permDelete: 'Y'
          });
        } else {
          alert(`No registered menu items found for module "${moduleName}". Please register a menu first.`);
        }
      }
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to update access mapping.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading access configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">{getMessage('Role vs Module')}</h2>
        <p className="text-[11px] text-slate-600 font-medium font-mono">
          Assign modules access rights to roles
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 text-xs">
        <div className="flex gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-800 mb-4 items-center">
          <ShieldAlert className="w-4 h-4 shrink-0 text-indigo-600" />
          <span className="font-semibold text-[10px]">
            Super Admin role has bypass rights and always holds full permissions. Changes here take effect on next page refresh.
          </span>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                  System Roles
                </th>
                {modules.map(mod => (
                  <th 
                    key={mod.id}
                    className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap"
                  >
                    {getMessage(mod.name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map(role => (
                <tr key={role.roleId} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{role.roleName}</td>
                  {modules.map(mod => {
                    const hasAccess = checkHasAccess(role.roleName, mod.name);
                    const isSuperAdminBypass = role.roleName === 'Super Admin';
                    return (
                      <td key={mod.id} className="px-4 py-3 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input 
                            type="checkbox"
                            disabled={isSuperAdminBypass}
                            checked={hasAccess}
                            onChange={() => handleToggleAccess(role.roleName, mod.name)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50"
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleModulePage;
