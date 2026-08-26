import React, { useState, useEffect } from 'react';
import { rolesApi, menusApi, modulesApi, roleMenuApi } from '../../../api/endpoints';
import type { RoleModel, MenuModel, RoleMenuModel } from '../../../types/models';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { ShieldAlert } from 'lucide-react';

export const RoleMenuPage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [menuItems, setMenuItems] = useState<MenuModel[]>([]);
  const [roleMenusList, setRoleMenusList] = useState<RoleMenuModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [rolesList, menusList, roleMenusData] = await Promise.all([
        rolesApi.list(),
        menusApi.list(),
        roleMenuApi.list()
      ]);
      setRoles(rolesList);
      setMenuItems(menusList);
      setRoleMenusList(roleMenusData);
    } catch (err) {
      console.error("Failed to load roles and menus mappings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const checkHasAccess = (roleName: string, menuCode: string): boolean => {
    if (roleName === 'Super Admin') return true;

    return roleMenusList.some(
      rm => rm.roleName?.toLowerCase() === roleName.toLowerCase() && 
            rm.menuId === menuItems.find(m => m.code?.toLowerCase() === menuCode.toLowerCase())?.id
    );
  };

  const handleToggleAccess = async (roleName: string, menuCode: string) => {
    // Super Admin menus cannot be disabled
    if (roleName === 'Super Admin') {
      alert('Super Admin must always have access to all menus.');
      return;
    }

    setLoading(true);
    try {
      const role = roles.find(r => r.roleName.toLowerCase() === roleName.toLowerCase());
      const menu = menuItems.find(m => m.code?.toLowerCase() === menuCode.toLowerCase());
      
      if (role && menu) {
        const allModules = await modulesApi.list();
        const moduleItem = allModules.find(mod => mod.id === menu.moduleId);

        if (moduleItem) {
          const hasAccess = checkHasAccess(roleName, menuCode);

          if (hasAccess) {
            const currentMappings = await roleMenuApi.listByRole(role.roleId);
            const targetRecord = currentMappings.find(rm => rm.menuId === menu.id);
            if (targetRecord && targetRecord.roleMenuId) {
              await roleMenuApi.remove(targetRecord.roleMenuId);
            }
          } else {
            await roleMenuApi.save({
              roleId: role.roleId,
              moduleId: moduleItem.id,
              menuId: menu.id,
              permView: 'Y',
              permAdd: 'Y',
              permEdit: 'Y',
              permDelete: 'Y'
            });
          }
        } else {
          alert('Menu item is not assigned to a valid module.');
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
          <p className="text-xs font-medium text-slate-400">Loading menu mappings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">{getMessage('Role vs Menu')}</h2>
        <p className="text-[11px] text-slate-600 font-medium font-mono">
          Configure menu visibility for specific roles
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 text-xs">
        <div className="flex gap-2 p-3 bg-violet-50 border border-violet-100 rounded-lg text-violet-800 mb-4 items-center">
          <ShieldAlert className="w-4 h-4 shrink-0 text-violet-600" />
          <span className="font-semibold text-[10px]">
            Super Admin role holds absolute visibility on all submenus. Custom roles must check visibility matrix cells to enable side navigation path options.
          </span>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                  Side Nav Option / Folder
                </th>
                {roles.map(role => (
                  <th 
                    key={role.roleId}
                    className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap"
                  >
                    {role.roleName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menuItems.map(menu => {
                const menuCodeStr = menu.code || '';
                return (
                  <tr key={menu.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{menu.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {menu.moduleName || 'Unmapped'} &bull; {menu.displayName || 'No Label'}
                      </div>
                    </td>
                    {roles.map(role => {
                      const hasAccess = checkHasAccess(role.roleName, menuCodeStr);
                      const isSuperAdminBypass = role.roleName === 'Super Admin';
                      return (
                        <td key={role.roleId} className="px-4 py-3 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer">
                            <input 
                              type="checkbox"
                              disabled={isSuperAdminBypass}
                              checked={hasAccess}
                              onChange={() => handleToggleAccess(role.roleName, menuCodeStr)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50"
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleMenuPage;
