import React, { useState, useEffect } from 'react';
import { usersApi, rolesApi, modulesApi, menusApi, roleMenuApi } from '../../../api/endpoints';
import type { UserModel, RoleModel, ModuleModel, MenuModel, RoleMenuModel } from '../../../types/models';
import { CircleCheckBig, CircleX } from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  
  const [users, setUsers] = useState<UserModel[]>([]);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [modules, setModules] = useState<ModuleModel[]>([]);
  const [menuItems, setMenuItems] = useState<MenuModel[]>([]);
  const [roleMenus, setRoleMenus] = useState<RoleMenuModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [usersList, rolesList, modulesList, menusList, roleMenusList] = await Promise.all([
          usersApi.list().catch(() => []),
          rolesApi.list().catch(() => []),
          modulesApi.list().catch(() => []),
          menusApi.list().catch(() => []),
          roleMenuApi.list().catch(() => [])
        ]);
        setUsers(usersList);
        setRoles(rolesList);
        setModules(modulesList);
        setMenuItems(menusList);
        setRoleMenus(roleMenusList);
      } catch (err) {
        console.error("Failed to load overview data from API:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOverviewData();
  }, []);

  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const activeRolesCount = roles.filter(r => r.status === 'Active').length;
  const activeMenuItemsCount = menuItems.filter(m => m.status === 'Active').length;

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getUserAvatarBg = (initial: string) => {
    switch (initial) {
      case 'R': return 'bg-violet-600';
      case 'G': return 'bg-orange-600';
      case 'C': return 'bg-rose-600';
      case 'S': return 'bg-emerald-600';
      default: return 'bg-blue-600';
    }
  };

  // Helper to calculate mapping statistics dynamically
  const getAccessStats = (moduleName: string) => {
    const totalRoles = roles.length;
    // Check role menu mappings for this module name
    const permittedRoles = roles.filter(r => 
      roleMenus.some(
        rm => rm.roleName?.toLowerCase() === r.roleName.toLowerCase() &&
              rm.moduleName?.toLowerCase() === moduleName.toLowerCase()
      )
    ).length;
    
    const percentage = totalRoles > 0 ? (permittedRoles / totalRoles) * 100 : 0;
    
    return {
      ratio: `${permittedRoles}/${totalRoles}`,
      percent: percentage,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">System Overview</h2>
        <p className="text-[11px] text-slate-600 font-medium font-mono">
          Janatics Admin Module — identity, access &amp; security
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Total Users</span>
          <span className="text-2xl font-bold text-slate-900">{users.length}</span>
          <span className="text-[10px] text-slate-600 font-medium">{activeUsersCount} active</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Roles</span>
          <span className="text-2xl font-bold text-purple-800">{roles.length}</span>
          <span className="text-[10px] text-slate-600 font-medium">{activeRolesCount} active</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Modules</span>
          <span className="text-2xl font-bold text-cyan-800">{modules.length}</span>
          <span className="text-[10px] text-slate-600 font-medium">all enabled</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Menu Items</span>
          <span className="text-2xl font-bold text-blue-800">{menuItems.length}</span>
          <span className="text-[10px] text-slate-600 font-medium">{activeMenuItemsCount} active</span>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Users Summary Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Recently Added Users
          </h3>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {users.slice(0, 6).map((u) => {
              const initial = getInitial(u.fullName);
              const isInactive = u.status === 'Inactive';
              return (
                <div key={u.userId} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${getUserAvatarBg(initial)}`}>
                      {initial}
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-900 font-semibold">{u.fullName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {u.reportsToName ? `→ ${u.reportsToName}` : 'Root'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-purple-800 font-mono font-semibold">{u.roleName}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      isInactive 
                        ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' 
                        : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                    }`}>
                      {isInactive ? <CircleX className="w-2.5 h-2.5" /> : <CircleCheckBig className="w-2.5 h-2.5" />}
                      {u.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Access Matrix Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Module Access Matrix Summary
          </h3>
          <div className="space-y-3">
            {modules.map((m) => {
              const stats = getAccessStats(m.name);
              return (
                <div key={m.id} className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-700 font-semibold w-24 truncate">{m.name}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 font-bold w-14 text-right">
                    {stats.ratio}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
