import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MesPage: React.FC = () => {
  const navigate = useNavigate();

  const dummyJobs = [
    { jobId: 'JB-MES-9941', machine: 'CNC-Line-02', product: 'Piston Head B-1', target: 500, actual: 488, status: 'Running' },
    { jobId: 'JB-MES-9940', machine: 'Mill-Line-04', product: 'Crankshaft Shell A', target: 200, actual: 200, status: 'Completed' },
    { jobId: 'JB-MES-9942', machine: 'Assembly-Bench-07', product: 'Valve Cluster X2', target: 1000, actual: 120, status: 'Setup' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" 
        style={{ background: 'rgb(248, 250, 252)', borderColor: 'rgb(232, 238, 248)' }}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">MES Module</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Shop Floor Control &amp; Machine Monitoring</span>
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-200">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Manufacturing Execution System</h1>
            <p className="text-[10px] text-slate-400 mt-1">Shop floor machine dispatching &amp; operations logs</p>
          </div>
        </div>

        {/* MES KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">OEE Efficiency</span>
            <span className="text-2xl font-bold text-slate-900">84.6%</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <Activity className="w-3.5 h-3.5" /> Exceeds target baseline (82%)
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Defect Logging</span>
            <span className="text-2xl font-bold text-slate-900">0.08% PPM</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO quality limits compliant
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Work Centers Offline</span>
            <span className="text-2xl font-bold text-amber-700">1 Unit</span>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> WC-07 in maintenance
            </span>
          </div>
        </div>

        {/* Shop floor job table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Active Shop Floor Job Dispatch Register
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-2.5">Job ID</th>
                  <th className="p-2.5">CNC Machine Unit</th>
                  <th className="p-2.5">Product SKU</th>
                  <th className="p-2.5 text-right">Target</th>
                  <th className="p-2.5 text-right">Actual Qty</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyJobs.map(j => (
                  <tr key={j.jobId} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono font-bold text-blue-700">{j.jobId}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{j.machine}</td>
                    <td className="p-2.5 font-semibold">{j.product}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-600">{j.target}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{j.actual}</td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        j.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 
                        j.status === 'Running' ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-300' :
                        'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                      }`}>
                        {j.status}
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

export default MesPage;
