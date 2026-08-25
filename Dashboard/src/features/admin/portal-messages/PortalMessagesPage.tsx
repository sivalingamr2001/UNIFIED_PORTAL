import React, { useState } from 'react';
import { useDatabase } from '../../../shared/hooks/useDatabase';
import type { PortalMessage } from '../../../types/domain';
import { Search, Pen, X, Save } from 'lucide-react';

export const PortalMessagesPage: React.FC = () => {
  const { portalMessages, updatePortalMessage, getMessage } = useDatabase();
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
            className="w-48 pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Grid view */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3 w-16">ID</th>
                <th className="p-3">Portal Code (Config Key)</th>
                <th className="p-3">Portal Text (Display Label)</th>
                <th className="p-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMessages.map(m => {
                const isEditing = editingMessage?.id === m.id;
                return (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-semibold text-slate-400">#{m.id}</td>
                    <td className="p-3 font-mono text-blue-700 font-bold">{m.portalCode}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-blue-500 font-semibold text-slate-800"
                        />
                      ) : (
                        <span className="font-semibold text-slate-700">{m.portalText}</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={handleSave}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-blue-200"
                            title="Save Label"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(m)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                          title="Edit Label"
                        >
                          <Pen className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortalMessagesPage;
