import React, { useState } from 'react';
import { useDatabase } from '../../../shared/hooks/useDatabase';
import type { MenuItem } from '../../../types/domain';
import { Search, Plus, Download, Pen, Trash2, Copy, X, AlertTriangle } from 'lucide-react';

export const MenuMasterPage: React.FC = () => {
  const { menuItems, modules, addMenuItem, updateMenuItem, deleteMenuItem, getMessage } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  // Form State
  const [menuName, setMenuName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [module, setModule] = useState('');
  const [parent, setParent] = useState('—');
  const [type, setType] = useState('Master');
  const [nature, setNature] = useState('Form');
  const [sort, setSort] = useState(1);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingMenuItem(null);
    setMenuName('');
    setDisplayName('');
    setModule(modules[0]?.name || '');
    setParent('—');
    setType('Master');
    setNature('Form');
    setSort(menuItems.length + 1);
    setStatus('Active');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: MenuItem) => {
    setEditingMenuItem(m);
    setMenuName(m.menuName);
    setDisplayName(m.displayName);
    setModule(m.module);
    setParent(m.parent);
    setType(m.type);
    setNature(m.nature);
    setSort(m.sort);
    setStatus(m.status);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!menuName.trim() || !displayName.trim() || !module) {
      setFormError('Please fill out all required fields.');
      return;
    }

    if (editingMenuItem) {
      updateMenuItem({
        ...editingMenuItem,
        menuName: menuName.trim(),
        displayName: displayName.trim(),
        module,
        parent,
        type,
        nature,
        sort,
        status,
      });
    } else {
      const exists = menuItems.some(m => m.menuName.toLowerCase() === menuName.trim().toLowerCase() && m.module === module);
      if (exists) {
        setFormError('Menu name already exists in this module.');
        return;
      }
      
      const newCode = `MNU00${menuItems.length + 1}`;
      addMenuItem({
        code: newCode,
        menuName: menuName.trim(),
        displayName: displayName.trim(),
        module,
        parent,
        type,
        nature,
        sort,
        status,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (code: string) => {
    if (window.confirm(`Are you sure you want to delete menu item ${code}?`)) {
      deleteMenuItem(code);
    }
  };

  const handleCopy = (m: MenuItem) => {
    navigator.clipboard.writeText(JSON.stringify(m, null, 2));
    alert(`Menu item details for ${m.menuName} copied!`);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Code', 'Menu Name', 'Display Name', 'Module', 'Parent', 'Type', 'Nature', 'Sort Order', 'Status'];
    const rows = filteredMenuItems.map((m, index) => [
      index + 1,
      m.code,
      m.menuName,
      m.displayName,
      m.module,
      m.parent,
      m.type,
      m.nature,
      m.sort,
      m.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "menu_master_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMenuItems = menuItems.filter(m => 
    m.menuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title & Search bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{getMessage('Menu Master')}</h2>
          <span className="text-[10px] font-mono text-slate-600 font-semibold border border-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
            {filteredMenuItems.length} records
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              placeholder="Search menus..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 font-medium w-48 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
            />
          </div>

          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] px-3 py-1.5 rounded transition-colors font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> New Item
          </button>
          
          <button 
            onClick={handleExportCSV}
            title="Export CSV"
            className="p-1.5 rounded border border-slate-300 text-slate-600 hover:text-slate-800 bg-white hover:border-slate-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Menus table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 sticky top-0 z-10">
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">#</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Code</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Menu Name</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Display Name</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Module</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Parent</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Type</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Nature</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Sort Order</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Status</th>
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenuItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-8 text-center text-slate-400 font-medium">
                    No menu records matching search found.
                  </td>
                </tr>
              ) : (
                filteredMenuItems.map((m, index) => (
                  <tr 
                    key={m.id} 
                    className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px]">{index + 1}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px] font-bold text-blue-700">{m.code}</td>
                    <td className="px-3 py-2.5 text-slate-900 whitespace-nowrap font-semibold">{m.menuName}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{m.displayName}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className="text-purple-800 font-semibold">{m.module}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap text-slate-500 font-medium">{m.parent}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        m.type === 'Master' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        m.type === 'Transaction' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-cyan-100 text-cyan-800 border-cyan-300'
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-semibold">
                        {m.nature}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px] font-bold text-center">{m.sort}</td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        m.status === 'Inactive' 
                          ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' 
                          : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(m)}
                          className="p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition-colors"
                        >
                          <Pen className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(m.code)}
                          className="p-1 rounded hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleCopy(m)}
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

      {/* CRUD Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingMenuItem ? `Edit Menu Item: ${editingMenuItem.code}` : 'Create New Menu Item'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Menu Name *</label>
                  <input 
                    type="text" 
                    required
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                    placeholder="Chart of Accounts"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Display Name *</label>
                  <input 
                    type="text" 
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                    placeholder="Accounts Ledger"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Module *</label>
                  <select 
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    {modules.map(mod => (
                      <option key={mod.id} value={mod.name}>{mod.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parent Item</label>
                  <input 
                    type="text" 
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                    placeholder="—"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    <option value="Master">Master</option>
                    <option value="Transaction">Transaction</option>
                    <option value="Report">Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nature</label>
                  <select 
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    <option value="Form">Form</option>
                    <option value="Report">Report</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Inquiry">Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sort Index</label>
                  <input 
                    type="number" 
                    value={sort}
                    onChange={(e) => setSort(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">status</label>
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuMasterPage;
