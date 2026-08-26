import React, { useState } from 'react';
import { usePortalMessages } from '../../../shared/hooks/usePortalMessages';
import type { PortalMessage } from '../../../types/domain';
import { Search, Pen, X, Save } from 'lucide-react';

export const PortalMessagesPage: React.FC = () => {
  const { portalMessages, updatePortalMessage, getMessage } = usePortalMessages();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMessage, setEditingMessage] = useState<PortalMessage | null>(null);
  const [editingText, setEditingText] = useState('');

  // Filter messages
  const filteredMessages = portalMessages.filter(m =>
    m.portalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.portalText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (m: PortalMessage) => {
    setEditingMessage(m);
    setEditingText(m.portalText);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditingText('');
  };

  const handleSave = () => {
    if (editingMessage) {
      updatePortalMessage({
        ...editingMessage,
        portalText: editingText,
      });
      setEditingMessage(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {getMessage('Portal Messages')}
          </h2>
          <span className="text-[10px] font-mono text-slate-600 font-semibold border border-slate-300 bg-slate-50 px-1.5 py-0.5 rounded">
            {filteredMessages.length} config keys
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48 pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Messages Table Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 sticky top-0 z-10">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                  Translation Key (Message Code)
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">
                  Active Label text
                </th>
                <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No custom translation strings defined. Set translations by seeding `localStorage` keys or loading from standard profile dictionary.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((m) => {
                  const isEditing = editingMessage?.id === m.id;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-slate-700">{m.portalCode}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input 
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">{m.portalText}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex gap-1 justify-center">
                            <button 
                              onClick={handleSave}
                              className="p-1 rounded hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEdit(m)}
                            className="p-1 rounded hover:bg-blue-50 text-slate-500 hover:text-blue-700 transition-colors inline-flex"
                          >
                            <Pen className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortalMessagesPage;
