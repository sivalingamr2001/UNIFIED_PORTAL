import React from 'react';
import { useDatabase } from '../../../shared/hooks/useDatabase';
import type { RoleMenuMapping } from '../../../types/domain';
import { ShieldAlert } from 'lucide-react';

export const RoleMenuPage: React.FC = () => {
  const { roles, menuItems, roleMenus, saveRoleMenus, getMessage } = useDatabase();

  const handleToggleAccess = (roleName: string, menuCode: string) => {
    // Super Admin menus cannot be disabled
    if (roleName === 'Super Admin') {
      alert('Super Admin must always have access to all menus.');
      return;
    }

    const exists = roleMenus.some(
      rm => rm.roleName.toLowerCase() === roleName.toLowerCase() && 
      rm.menuCode === menuCode
    );

    let updatedMappings: RoleMenuMapping[];

    if (exists) {
      updatedMappings = roleMenus.map(rm => {
        if (rm.roleName.toLowerCase() === roleName.toLowerCase() && 
            rm.menuCode === menuCode) {
          return { ...rm, hasAccess: !rm.hasAccess };
        }
        return rm;
      });
    } else {
      updatedMappings = [
        ...roleMenus,
        { roleName, menuCode, hasAccess: true }
      ];
    }

    saveRoleMenus(updatedMappings);
  };

  const checkHasAccess = (roleName: string, menuCode: string): boolean => {
    if (roleName === 'Super Admin') return true;

    const mapping = roleMenus.find(
      rm => rm.roleName.toLowerCase() === roleName.toLowerCase() && 
      rm.menuCode === menuCode
    );
    return mapping ? mapping.hasAccess : false;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">{getMessage('Role vs Menu')}</h2>
        <p className="text-[11px] text-slate-600 font-medium font-mono">
          Configure menu visibility for specific roles
        </p>
      </div>

      {/* Access Matrix Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                  Role Name
                </th>
                {menuItems.map(m => (
                  <th 
                    key={m.id} 
                    className="px-3 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap"
                    title={`${m.menuName} (${m.module})`}
                  >
                    {m.menuName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                    {r.name}
                  </td>
                  {menuItems.map(m => {
                    const hasAccess = checkHasAccess(r.name, m.code);
                    const isDisabled = r.name === 'Super Admin';
                    return (
                      <td key={m.id} className="px-3 py-3 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={hasAccess}
                            disabled={isDisabled}
                            onChange={() => handleToggleAccess(r.name, m.code)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
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

      {/* Alert Notice */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex gap-2">
        <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="font-semibold leading-relaxed">
          Menu restrictions only affect sidebar link visibility. User access rights for functional APIs can be locked inside User Access Rights mapping.
        </p>
      </div>
    </div>
  );
};

export default RoleMenuPage;
