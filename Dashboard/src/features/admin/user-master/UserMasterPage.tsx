import React, { useState, useEffect } from 'react';
import { usersApi, rolesApi } from '../../../api/endpoints';
import type { UserModel, RoleModel } from '../../../types/models';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { Search, Plus, Download, Pen, Trash2, Copy, X, CircleAlert } from 'lucide-react';

export const UserMasterPage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  
  const [users, setUsers] = useState<UserModel[]>([]);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserModel | null>(null);
  
  // Form Fields State
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [roleName, setRoleName] = useState('');
  const [type, setType] = useState('Employee');
  const [sec, setSec] = useState(50);
  const [reportsTo, setReportsTo] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsersAndRoles = async () => {
    try {
      const [usersList, rolesList] = await Promise.all([
        usersApi.list(),
        rolesApi.list()
      ]);
      setUsers(usersList);
      setRoles(rolesList);
    } catch (err) {
      console.error("Failed to fetch users and roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  // Open modal for Adding
  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setLogin('');
    setEmail('');
    setMobile('');
    setRoleName(roles[0]?.roleName || '');
    setType('Employee');
    setSec(50);
    setReportsTo('');
    setValidFrom(new Date().toISOString().split('T')[0]);
    setValidTo(new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]);
    setStatus('Active');
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (u: UserModel) => {
    setEditingUser(u);
    setName(u.fullName);
    setLogin(u.userName);
    setEmail(u.primaryEmail);
    setMobile(u.primaryMobile);
    setRoleName(u.roleName || '');
    setType(u.userType || 'Employee');
    setSec(u.securityLevel || 50);
    setReportsTo(u.reportsToName || '');
    setValidFrom(u.validFrom ? u.validFrom.split('T')[0] : '');
    setValidTo(u.validTo ? u.validTo.split('T')[0] : '');
    setStatus(u.status === 'Inactive' ? 'Inactive' : 'Active');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !login || !email || !roleName) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const matchedRoleId = roles.find(r => r.roleName.toLowerCase() === roleName.toLowerCase())?.roleId;
    const matchedReportsToUser = users.find(u => u.fullName.toLowerCase() === reportsTo.toLowerCase());

    const payload: Partial<UserModel> = {
      userCode: editingUser ? editingUser.userCode : `USR00${users.length + 1}`,
      fullName: name,
      userName: login,
      primaryEmail: email,
      primaryMobile: mobile,
      roleId: matchedRoleId || undefined,
      roleName: roleName,
      userType: type,
      securityLevel: sec,
      reportingTo: matchedReportsToUser?.userId || undefined,
      reportsToName: reportsTo || undefined,
      validFrom: validFrom,
      validTo: validTo || undefined,
      status: status,
      password: "Password123!"
    };

    try {
      if (editingUser) {
        await usersApi.update(editingUser.userId, payload);
      } else {
        const usernameExists = users.some(u => u.userName.toLowerCase() === login.toLowerCase());
        if (usernameExists) {
          setFormError('Username login code already exists.');
          return;
        }
        await usersApi.create(payload);
      }
      setModalOpen(false);
      setLoading(true);
      await fetchUsersAndRoles();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save user record.');
    }
  };

  const handleDelete = async (userId: number, fullName: string) => {
    if (window.confirm(`Are you sure you want to delete user ${fullName}?`)) {
      try {
        await usersApi.remove(userId);
        setLoading(true);
        await fetchUsersAndRoles();
      } catch (err: any) {
        alert(err.message || 'Failed to delete user.');
      }
    }
  };

  const handleCopy = (u: UserModel) => {
    navigator.clipboard.writeText(JSON.stringify(u, null, 2));
    alert(`User details for ${u.fullName} copied to clipboard!`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['#', 'Code', 'Name', 'Login', 'Email', 'Mobile', 'Role', 'Type', 'Security Level', 'Reports To', 'Valid From', 'Valid To', 'Status'];
    const rows = filteredUsers.map((u, index) => [
      index + 1,
      u.userCode,
      u.fullName,
      u.userName,
      u.primaryEmail,
      u.primaryMobile,
      u.roleName || '',
      u.userType || 'Employee',
      u.securityLevel || 50,
      u.reportsToName || 'None',
      u.validFrom || '',
      u.validTo || '',
      u.status || 'Active',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_master_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.roleName && u.roleName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading user master records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title & Actions Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{getMessage('User Master')}</h2>
          <span className="text-[10px] font-mono text-slate-600 font-semibold border border-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
            {filteredUsers.length} records
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 font-medium w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
            />
          </div>

          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] px-3 py-1.5 rounded transition-colors font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
          
          <button 
            onClick={handleExportCSV}
            title="Export CSV"
            className="p-1.5 rounded border border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-400 bg-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Users Grid Card / Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 sticky top-0 z-10">
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">#</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Code</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Name</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Username</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Email</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Role</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Type</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Security Level</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Reports To</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Valid Path</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Status</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-slate-400 font-medium">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr 
                    key={u.userId} 
                    className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px]">{index + 1}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px] font-bold text-blue-700">{u.userCode}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 bg-blue-600">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-900">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px]">{u.userName}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{u.primaryEmail}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className="text-purple-800 font-semibold">{u.roleName}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                        {u.userType}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px] text-center">
                      <span className="font-bold text-amber-700">{u.securityLevel}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap text-slate-600 font-medium">
                      {u.reportsToName || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[10px] text-slate-500">
                      {u.validFrom ? u.validFrom.split('T')[0] : ''} to {u.validTo ? u.validTo.split('T')[0] : ''}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        u.status === 'Inactive' 
                          ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' 
                          : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(u)}
                          className="p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition-colors"
                        >
                          <Pen className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.userId, u.fullName)}
                          className="p-1 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleCopy(u)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Form Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingUser ? `Edit User: ${editingUser.userCode}` : 'Create New User Record'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-2">
                  <CircleAlert className="w-4 h-4 text-red-500 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Username Login *</label>
                  <input 
                    type="text" 
                    required
                    disabled={!!editingUser}
                    value={login}
                    onChange={(e) => setLogin(e.target.value.toLowerCase().replace(/\s/g, ''))}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder="e.g. jsmith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Email *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    placeholder="name@janatics.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Mobile</label>
                  <input 
                    type="text" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    placeholder="+91 99999 99999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Role Type *</label>
                  <select 
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    {roles.map(r => (
                      <option key={r.roleId} value={r.roleName}>{r.roleName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Contract Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Security Rating (0-99)</label>
                  <input 
                    type="number" 
                    value={sec}
                    onChange={(e) => setSec(parseInt(e.target.value) || 0)}
                    min={0}
                    max={99}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Reports To</label>
                  <select 
                    value={reportsTo}
                    onChange={(e) => setReportsTo(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    <option value="">None (Top Level Root)</option>
                    {users
                      .filter(u => u.userCode !== editingUser?.userCode) // Prevent self-reporting
                      .map(u => (
                        <option key={u.userId} value={u.fullName}>{u.fullName} ({u.roleName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Valid From</label>
                  <input 
                    type="date" 
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Valid To</label>
                  <input 
                    type="date" 
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Account status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Active (Allowed Login access)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="status"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    Inactive (Blocked)
                  </label>
                </div>
              </div>

              {/* Modal Footer Actions */}
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMasterPage;
