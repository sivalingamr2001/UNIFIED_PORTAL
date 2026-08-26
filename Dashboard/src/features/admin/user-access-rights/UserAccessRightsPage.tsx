import React, { useState, useEffect } from 'react';
import { usersApi, modulesApi, userAccessRightsApi } from '../../../api/endpoints';
import type { UserModel, ModuleModel } from '../../../types/models';
import type { UserAccessRight } from '../../../types/domain';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { ShieldCheck } from 'lucide-react';

export const UserAccessRightsPage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  
  const [users, setUsers] = useState<UserModel[]>([]);
  const [modules, setModules] = useState<ModuleModel[]>([]);
  const [userAccessRights, setUserAccessRights] = useState<UserAccessRight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const fetchAllData = async () => {
    try {
      const [usersList, modulesList, rightsList] = await Promise.all([
        usersApi.list(),
        modulesApi.list(),
        userAccessRightsApi.list()
      ]);
      
      let mappedUserAccessRights: UserAccessRight[] = [];
      rightsList.forEach((uar) => {
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
      
      setUsers(usersList);
      setModules(modulesList);
      setUserAccessRights(mappedUserAccessRights);
      
      if (usersList.length > 0 && !selectedUsername) {
        setSelectedUsername(usersList[0].userName);
      }
    } catch (err) {
      console.error("Failed to load user access rights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getRightsForModule = (username: string, moduleName: string): UserAccessRight => {
    const existing = userAccessRights.find(
      r => r.username.toLowerCase() === username.toLowerCase() && 
      r.moduleName.toLowerCase() === moduleName.toLowerCase()
    );

    if (existing) return existing;

    return {
      username,
      moduleName,
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
    };
  };

  const saveUserAccessRights = async (rights: UserAccessRight[]) => {
    setUserAccessRights(rights);
    const user = users.find(u => u.userName.toLowerCase() === selectedUsername.toLowerCase());
    if (user) {
      const userRights = rights.filter(r => r.username.toLowerCase() === selectedUsername.toLowerCase());
      try {
        await userAccessRightsApi.removeAllForUser(user.userId);
        await userAccessRightsApi.save({
          id: 0,
          userId: user.userId,
          roleId: 0,
          remarks: JSON.stringify(userRights)
        });
      } catch (err) {
        console.error(`Failed to save access rights:`, err);
      }
    }
  };

  const handleToggleRight = (moduleName: string, field: 'canView' | 'canCreate' | 'canEdit' | 'canDelete') => {
    const matchedUser = users.find(u => u.userName === selectedUsername);
    if (matchedUser?.roleName === 'Super Admin') {
      alert('Super Admin permissions cannot be restricted.');
      return;
    }

    const currentRight = getRightsForModule(selectedUsername, moduleName);
    const updatedRight = {
      ...currentRight,
      [field]: !currentRight[field]
    };

    if (field === 'canView' && !updatedRight.canView) {
      updatedRight.canCreate = false;
      updatedRight.canEdit = false;
      updatedRight.canDelete = false;
    }

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

  const selectedUser = users.find(u => u.userName === selectedUsername);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading access rights...</p>
        </div>
      </div>
    );
  }

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
              <option key={u.userId} value={u.userName}>
                {u.fullName} ({u.roleName})
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
              Editing permissions for: <strong className="text-slate-800">{selectedUser.fullName}</strong>
            </span>
            <span className="text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold">
              {selectedUser.roleName || 'Viewer'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Module / Feature Area
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    View Access
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Create Access
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Edit Access
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                    Delete Access
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {modules.map(mod => {
                  const rights = getRightsForModule(selectedUsername, mod.name);
                  const isSuperAdmin = selectedUser.roleName === 'Super Admin';
                  return (
                    <tr key={mod.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{getMessage(mod.name)}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {mod.code} &bull; {mod.description || 'Enterprise module'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox"
                          disabled={isSuperAdmin}
                          checked={isSuperAdmin || rights.canView}
                          onChange={() => handleToggleRight(mod.name, 'canView')}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox"
                          disabled={isSuperAdmin || !rights.canView}
                          checked={isSuperAdmin || rights.canCreate}
                          onChange={() => handleToggleRight(mod.name, 'canCreate')}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox"
                          disabled={isSuperAdmin || !rights.canView}
                          checked={isSuperAdmin || rights.canEdit}
                          onChange={() => handleToggleRight(mod.name, 'canEdit')}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox"
                          disabled={isSuperAdmin || !rights.canView}
                          checked={isSuperAdmin || rights.canDelete}
                          onChange={() => handleToggleRight(mod.name, 'canDelete')}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 disabled:opacity-50 cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Access matrix warning banner */}
      <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-800">Permissions Inheritance Notice</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            By default, users inherit access rights directly from their primary Role mappings. 
            Any checkbox configured above acts as a <strong>User-level override</strong>, bypassing the default role permissions block entirely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAccessRightsPage;
