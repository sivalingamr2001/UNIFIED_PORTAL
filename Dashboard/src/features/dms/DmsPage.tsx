import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FileSpreadsheet, Layers, Clock } from 'lucide-react';

export const DmsPage: React.FC = () => {
  const navigate = useNavigate();

  const dummyDocs = [
    { code: 'DOC-ISO-1002', name: 'Quality Manual revision B', version: 'v3.2', author: 'Rajalakshmi', reviewer: 'Govindaraj', status: 'Approved' },
    { code: 'DOC-SCM-4401', name: 'Bearing Assembly minimum standards', version: 'v1.4', author: 'Sathish', reviewer: 'Raaman', status: 'Draft' },
    { code: 'DOC-FIN-0099', name: 'VAT filing procedures 2026', version: 'v2.1', author: 'Govindaraj', reviewer: 'Rajalakshmi', status: 'Approved' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" 
        style={{ background: 'rgb(248, 250, 252)', borderColor: 'rgb(232, 238, 248)' }}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">DMS Module</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Document Management, Revisioning &amp; Vault</span>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-100"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: 'thin' }}>
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Dealer Document Registry</h1>
            <p className="text-[10px] text-slate-400 mt-1">Version control, revision mapping &amp; approval workflows</p>
          </div>
        </div>

        {/* DMS KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Total Documents</span>
            <span className="text-2xl font-bold text-slate-900">342 Records</span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Vault contains 3.2 GB data
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Pending Review</span>
            <span className="text-2xl font-bold text-amber-700">12 Documents</span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Average review queue: 2 days
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Archived Versions</span>
            <span className="text-2xl font-bold text-slate-700">84 Items</span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-500" /> 100% revision logs tracked
            </span>
          </div>
        </div>

        {/* Document table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Active Revision Control Vault
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-2.5">Doc ID</th>
                  <th className="p-2.5">Document Name</th>
                  <th className="p-2.5">Rev</th>
                  <th className="p-2.5">Author</th>
                  <th className="p-2.5">Reviewer</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyDocs.map(d => (
                  <tr key={d.code} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono font-bold text-blue-700">{d.code}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{d.name}</td>
                    <td className="p-2.5 font-mono text-slate-500 font-semibold">{d.version}</td>
                    <td className="p-2.5">{d.author}</td>
                    <td className="p-2.5">{d.reviewer}</td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        d.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DmsPage;
