import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, LayoutDashboard, AlertTriangle, ArrowRight, Activity, Award } from 'lucide-react';

export const PesDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" 
        style={{ background: 'rgb(248, 250, 252)', borderColor: 'rgb(232, 238, 248)' }}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">PES Module</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Planning &amp; Execution Control Hub</span>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded hover:bg-slate-100"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main panel content */}
      <main className="flex-1 overflow-y-auto p-5 space-y-6" style={{ scrollbarWidth: 'thin' }}>
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">PES Overview</h1>
            <p className="text-[10px] text-slate-400 mt-1">Planning Execution System Portal</p>
          </div>
        </div>

        {/* Dashboard Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mb-3">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Planning &amp; Execution Control Tower</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track WTD production plans, achievements, shortfalls, and top production gaps across all lines.
              </p>
            </div>
            <Link 
              to="/pes/control-tower" 
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-3"
            >
              Open Control Tower <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-44">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 mb-3">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Product Custodian Portfolio</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Review assigned product groups across AMS1/AMS2, check MTD variances, and quality rejection PPMs.
              </p>
            </div>
            <Link 
              to="/pes/product-custodian" 
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-3"
            >
              Open Custodian Portfolio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Stats */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Aggregate Planning Performance (WTD)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Plan Achievement</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">90.5% MTD</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Quality Defect PPM</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">320 PPM (Excellent)</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Critical Gaps Mapped</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">4 Products at Risk</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PesDashboardPage;
