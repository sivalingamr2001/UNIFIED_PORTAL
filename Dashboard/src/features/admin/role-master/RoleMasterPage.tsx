import React, { useState } from 'react';
import { useDatabase } from '../../../shared/hooks/useDatabase';
import type { Role } from '../../../types/domain';
import { Search, Plus, Pen, Trash2, X, AlertTriangle } from 'lucide-react';

export const RoleMasterPage: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole, users, getMessage } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setName('');
    setStatus('Active');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (r: Role) => {
    setEditingRole(r);
    setName(r.name);
    setStatus(r.status);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Role name is required.');
      return;
    }

    if (editingRole) {
      updateRole({
        ...editingRole,
        name: name.trim(),
        status,
      });
    } else {
      const exists = roles.some(r => r.name.toLowerCase() === name.trim().toLowerCase());
      if (exists) {
        setFormError('Role name already exists.');
        return;
      }
      
      const newCode = `ROL00${roles.length + 1}`;
      addRole({
        code: newCode,
        name: name.trim(),
        status,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (r: Role) => {
    // Check if any users are assigned this role
    const assignedUsers = users.filter(u => u.role.toLowerCase() === r.name.toLowerCase());
    if (assignedUsers.length > 0) {
      alert(`Cannot delete role "${r.name}" because it is currently assigned to ${assignedUsers.length} user(s).`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete role ${r.code}?`)) {
      deleteRole(r.code);
    }
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header Controls */}
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
              className="bg-white border border-slate-300 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 font-medium w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
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

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredRoles.map(r => {
          const userCount = users.filter(u => u.role.toLowerCase() === r.name.toLowerCase()).length;
          return (
            <div 
              key={r.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wide">
                    {r.code}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold ${
                    r.status === 'Active' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{r.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Active users assigned: <strong className="text-slate-800">{userCount}</strong>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(r)}
                  className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <Pen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingRole ? `Edit Role: ${editingRole.code}` : 'Create New Role Code'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
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
                  placeholder="e.g. Production Manager"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Role status</label>
                <div className="flex gap-4 mt-1">
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
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors text-xs font-semibold shadow-sm"
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
