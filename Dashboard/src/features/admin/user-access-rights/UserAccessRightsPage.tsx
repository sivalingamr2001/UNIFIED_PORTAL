import React, { useState } from 'react';
import { useDatabase } from '../../../shared/hooks/useDatabase';
import type { UserAccessRight } from '../../../types/domain';
import { ShieldCheck } from 'lucide-react';

export const UserAccessRightsPage: React.FC = () => {
  const { users, modules, userAccessRights, saveUserAccessRights, getMessage } = useDatabase();
  const [selectedUsername, setSelectedUsername] = useState<string>(() => {
    return users[0]?.login || '';
  });

  const getRightsForModule = (username: string, moduleName: string): UserAccessRight => {
    const existing = userAccessRights.find(
      r => r.username.toLowerCase() === username.toLowerCase() && 
      r.moduleName.toLowerCase() === moduleName.toLowerCase()
    );

    if (existing) return existing;

    // Return default empty right
    return {
      username,
      moduleName,
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
    };
  };

  const handleToggleRight = (moduleName: string, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete') => {
    // If Super Admin user, prevent toggling (they have full rights)
    const matchedUser = users.find(u => u.login === selectedUsername);
    if (matchedUser?.role === 'Super Admin') {
      alert('Super Admin permissions cannot be restricted.');
      return;
    }

    const currentRight = getRightsForModule(selectedUsername, moduleName);
    const updatedRight = {
      ...currentRight,
      [field]: !currentRight[field]
    };

    // If canView is disabled, turn off create/edit/delete as well
    if (field === 'canView' && !updatedRight.canView) {
      updatedRight.canCreate = false;
      updatedRight.canEdit = false;
      updatedRight.canDelete = false;
    }

    // If any edit/create/delete is enabled, ensure canView is enabled
    if (field !== 'canView' && updatedRight[field]) {
      updatedRight.canView = true;
    }

    const exists = userAccessRights.some(
      r => r.username.toLowerCase() === selectedUsername.toLowerCase() && 
      r.moduleName.toLowerCase() === moduleName.toLowerCase()
    );

    let updatedRights: UserAccessRight[];
    if (exists) {
      updatedRights = userAccessRights.map(r => {
        if (r.username.toLowerCase() === selectedUsername.toLowerCase() && 
            r.moduleName.toLowerCase() === moduleName.toLowerCase()) {
          return updatedRight;
        }
        return r;
      });
    } else {
      updatedRights = [...userAccessRights, updatedRight];
    }

    saveUserAccessRights(updatedRights);
  };

  const selectedUser = users.find(u => u.login === selectedUsername);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">{getMessage('User Access Rights')}</h2>
          <p className="text-[11px] text-slate-600 font-medium font-mono">
            Directly override permissions per user
          </p>
        </div>

        {/* User Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Select User:</span>
          <select 
            value={selectedUsername} 
            onChange={(e) => setSelectedUsername(e.target.value)}
            className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
          >
            {users.map(u => (
              <option key={u.id} value={u.login}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Access Matrix Table Card */}
      {selectedUser && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Editing permissions for: <strong className="text-slate-800">{selectedUser.name}</strong>
            </span>
            <span className="text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold">
              {selectedUser.role}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/50">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Module Name
                  </th>
                  <th className="px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Can View (Read)
                  </th>
                  <th className="px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Can Create (Write)
                  </th>
                  <th className="px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Can Edit (Update)
                  </th>
                  <th className="px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Can Delete (Delete)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map(m => {
                  const rights = getRightsForModule(selectedUsername, m.name);
                  const isSuper = selectedUser.role === 'Super Admin';
                  
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {m.name}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isSuper || rights.canView}
                            disabled={isSuper}
                            onChange={() => handleToggleRight(m.name, 'canView')}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                          />
                        </label>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isSuper || rights.canCreate}
                            disabled={isSuper}
                            onChange={() => handleToggleRight(m.name, 'canCreate')}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                          />
                        </label>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isSuper || rights.canEdit}
                            disabled={isSuper}
                            onChange={() => handleToggleRight(m.name, 'canEdit')}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                          />
                        </label>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isSuper || rights.canDelete}
                            disabled={isSuper}
                            onChange={() => handleToggleRight(m.name, 'canDelete')}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                          />
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info notice box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="font-semibold leading-relaxed">
          User-level rights override role-level mappings. If a user is granted View rights directly, it guarantees access even if their role module matrix is unselected.
        </p>
      </div>
    </div>
  );
};

export default UserAccessRightsPage;
