import React, { useState, useEffect } from 'react';
import { rolesApi, usersApi } from '../../../api/endpoints';
import type { RoleModel, UserModel } from '../../../types/models';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { Search, Plus, Pen, Trash2, X, AlertTriangle } from 'lucide-react';

export const RoleMasterPage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleModel | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchRolesAndUsers = async () => {
    try {
      const [rolesList, usersList] = await Promise.all([
        rolesApi.list(),
        usersApi.list()
      ]);
      setRoles(rolesList);
      setUsers(usersList);
    } catch (err) {
      console.error("Failed to load roles and users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setName('');
    setStatus('Active');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (r: RoleModel) => {
    setEditingRole(r);
    setName(r.roleName);
    setStatus(r.status === 'Inactive' ? 'Inactive' : 'Active');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Role name is required.');
      return;
    }

    const payload: Partial<RoleModel> = {
      roleCode: editingRole ? editingRole.roleCode : `ROL00${roles.length + 1}`,
      roleName: name.trim(),
      status: status
    };

    try {
      if (editingRole) {
        await rolesApi.update(editingRole.roleId, payload);
      } else {
        const exists = roles.some(r => r.roleName.toLowerCase() === name.trim().toLowerCase());
        if (exists) {
          setFormError('Role name already exists.');
          return;
        }
        await rolesApi.create(payload);
      }
      setModalOpen(false);
      setLoading(true);
      await fetchRolesAndUsers();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save role.');
    }
  };

  const handleDelete = async (roleId: number, roleName: string) => {
    // Check if any active user is using this role
    const usersWithRole = users.filter(u => u.roleName?.toLowerCase() === roleName.toLowerCase() && u.status === 'Active');
    if (usersWithRole.length > 0) {
      alert(`Cannot delete role "${roleName}" because it is currently assigned to ${usersWithRole.length} active user(s).`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete role: "${roleName}"?`)) {
      try {
        await rolesApi.remove(roleId);
        setLoading(true);
        await fetchRolesAndUsers();
      } catch (err: any) {
        alert(err.message || 'Failed to delete role.');
      }
    }
  };

  // Helper to count users in a role
  const getUserCountForRole = (roleNameStr: string) => {
    return users.filter(u => u.roleName?.toLowerCase() === roleNameStr.toLowerCase()).length;
  };

  const filteredRoles = roles.filter(r => 
    r.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.roleCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading role master records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{getMessage('Role Master')}</h2>
          <span className="text-[10px] font-mono text-slate-600 font-semibold border border-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
            {filteredRoles.length} records
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              placeholder="Search roles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 font-medium w-48 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] px-3 py-1.5 rounded transition-colors font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Role
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredRoles.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 font-medium text-xs">
            No system roles matching filters found.
          </div>
        ) : (
          filteredRoles.map((r) => {
            const userCount = getUserCountForRole(r.roleName);
            const isInactive = r.status === 'Inactive';
            return (
              <div 
                key={r.roleId}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">{r.roleCode}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      isInactive ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300/50'
                    }`}>
                      {r.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {r.roleName}
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    {userCount} active users assigned
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEdit(r)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
                  >
                    <Pen className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(r.roleId, r.roleName)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-xs">
                {editingRole ? `Edit Role: ${editingRole.roleCode}` : 'Create New System Role'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Role Name *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  placeholder="e.g. Operations Coordinator"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Role status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Inactive
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleMasterPage;
