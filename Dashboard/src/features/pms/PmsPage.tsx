import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Award, Users } from 'lucide-react';

export const PmsPage: React.FC = () => {
  const navigate = useNavigate();

  const dummyAppraisals = [
    { dept: 'Production CNC Floor', targetScore: '85.0%', currentScore: '86.4%', index: 1.02, status: 'On Track' },
    { dept: 'Procurement SCM Team', targetScore: '90.0%', currentScore: '89.2%', index: 0.99, status: 'Warning' },
    { dept: 'HR & Administration', targetScore: '80.0%', currentScore: '82.5%', index: 1.03, status: 'On Track' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" 
        style={{ background: 'rgb(248, 250, 252)', borderColor: 'rgb(232, 238, 248)' }}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">PMS Module</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Performance review dashboards &amp; Appraisals</span>
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-50 text-pink-600 border border-pink-200">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Performance Monitoring System</h1>
            <p className="text-[10px] text-slate-400 mt-1">Appraisal goals tracking &amp; department KPI logs</p>
          </div>
        </div>

        {/* PMS KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Goals Configured</span>
            <span className="text-2xl font-bold text-slate-900">89% Done</span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" /> 74/83 employees mapped
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Appraisal Reviews</span>
            <span className="text-2xl font-bold text-slate-900">7 Pending</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Phase 2 appraisals active
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Average Efficiency score</span>
            <span className="text-2xl font-bold text-emerald-700">92.3%</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +1.4% improvement QoQ
            </span>
          </div>
        </div>

        {/* Department KPIs table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Department Performance index register
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5 text-right">Target Score</th>
                  <th className="p-2.5 text-right">Current Score</th>
                  <th className="p-2.5 text-right">Index Coefficient</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyAppraisals.map(a => (
                  <tr key={a.dept} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-semibold text-slate-800">{a.dept}</td>
                    <td className="p-2.5 text-right font-mono font-medium text-slate-500">{a.targetScore}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-800">{a.currentScore}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-blue-700">{a.index}</td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        a.status === 'On Track' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                      }`}>
                        {a.status}
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

export default PmsPage;
