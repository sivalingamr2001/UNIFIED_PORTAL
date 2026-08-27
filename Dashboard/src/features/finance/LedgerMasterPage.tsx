import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LedgerMasterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0 bg-slate-50 border-slate-200" 
      >
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-slate-700">Ledger Master</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Under Construction</span>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-5 bg-[#f0f4f8]" style={{ scrollbarWidth: 'thin' }}>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-md">
          <h1 className="text-sm font-bold text-slate-900 mb-2">Ledger Master</h1>
          <p className="text-xs text-slate-500">This section is currently under construction.</p>
        </div>
      </main>
    </div>
  );
};

export default LedgerMasterPage;
