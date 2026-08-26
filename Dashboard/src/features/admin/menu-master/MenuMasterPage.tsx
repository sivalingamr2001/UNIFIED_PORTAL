import React, { useState, useEffect } from 'react';
import { menusApi, modulesApi } from '../../../api/endpoints';
import type { ModuleModel } from '../../../types/models';
import type { MenuItem } from '../../../types/domain';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import { Search, Plus, Download, Pen, Trash2, Copy, X, AlertTriangle } from 'lucide-react';

export const MenuMasterPage: React.FC = () => {
  const { getMessage } = usePortalMessages();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modules, setModules] = useState<ModuleModel[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchMenusAndModules = async () => {
    try {
      const [menusList, modulesList] = await Promise.all([
        menusApi.list(),
        modulesApi.list()
      ]);
      
      const mapped = menusList.map((m) => {
        const parentMenu = menusList.find(pm => pm.id === m.parentMenuId);
        return {
          id: m.id,
          code: m.code || '',
          menuName: m.name,
          displayName: m.displayName || '',
          module: m.moduleName || '',
          parent: parentMenu ? parentMenu.name : '—',
          type: m.menuType || 'Master',
          nature: m.nature || 'Form',
          sort: m.sortOrder || 1,
          status: m.status === 'Inactive' ? 'Inactive' : 'Active' as 'Active' | 'Inactive'
        };
      });
      
      setMenuItems(mapped);
      setModules(modulesList);
    } catch (err) {
      console.error("Failed to load menus and modules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenusAndModules();
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!menuName.trim() || !displayName.trim() || !module) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const matchedModule = modules.find(m => m.name.toLowerCase() === module.toLowerCase());
    const matchedParent = menuItems.find(mi => mi.menuName.toLowerCase() === parent.toLowerCase());

    const payload = {
      menuId: editingMenuItem ? editingMenuItem.id : undefined,
      menuCode: editingMenuItem ? editingMenuItem.code : `MNU00${menuItems.length + 1}`,
      menuName: menuName.trim(),
      displayName: displayName.trim(),
      moduleId: matchedModule?.id || undefined,
      moduleName: module,
      parentMenuId: matchedParent?.id || undefined,
      menuType: type,
      nature: nature,
      sortOrder: sort,
      status: status
    };

    try {
      if (editingMenuItem) {
        await menusApi.update(editingMenuItem.id, payload);
      } else {
        await menusApi.create(payload);
      }
      setModalOpen(false);
      setLoading(true);
      await fetchMenusAndModules();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save menu item.');
    }
  };

  const handleDelete = async (code: string) => {
    const targetMenu = menuItems.find(m => m.code.toLowerCase() === code.toLowerCase());
    if (targetMenu && window.confirm(`Are you sure you want to delete menu item: ${code}?`)) {
      try {
        await menusApi.remove(targetMenu.id);
        setLoading(true);
        await fetchMenusAndModules();
      } catch (err: any) {
        alert(err.message || 'Failed to delete menu item.');
      }
    }
  };

  const handleCopy = (m: MenuItem) => {
    navigator.clipboard.writeText(JSON.stringify(m, null, 2));
    alert(`Menu item copy done for ${m.menuName}!`);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Code', 'Menu Name', 'Display Name', 'Module', 'Parent Menu', 'Type', 'Nature', 'Sort Order', 'Status'];
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
    m.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-xs font-medium text-slate-400">Loading menu master records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Title & Actions Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{getMessage('Menu Master')}</h2>
          <span className="text-[10px] font-mono text-slate-600 font-semibold border border-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
            {filteredMenuItems.length} records
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              placeholder="Search menus..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 font-medium w-48 focus:outline-none focus:border-blue-500"
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
            className="p-1.5 rounded border border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-400 bg-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Table */}
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
                <th className="px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">Parent Menu</th>
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
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-2">
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
                    placeholder="e.g. general-ledger"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Display Label *</label>
                  <input 
                    type="text" 
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                    placeholder="e.g. General Ledger"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Module *</label>
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
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parent Section</label>
                  <select 
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    <option value="—">None (Root Directory)</option>
                    {menuItems
                      .filter(m => m.code !== editingMenuItem?.code)
                      .map(m => (
                        <option key={m.id} value={m.menuName}>{m.menuName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
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
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 outline-none bg-white focus:border-blue-500"
                  >
                    <option value="Form">Form</option>
                    <option value="Grid">Grid</option>
                    <option value="Chart">Chart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sort Order</label>
                  <input 
                    type="number" 
                    value={sort}
                    onChange={(e) => setSort(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Menu status</label>
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

export default MenuMasterPage;
