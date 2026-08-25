import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CircleHelp, ArrowRight, Funnel, ClipboardList, Factory, TrendingUp, TrendingDown } from 'lucide-react';

export const PlanningControlTowerPage: React.FC = () => {
  const navigate = useNavigate();

  const sourceData = [
    { segment: 'AMS1 In-house', plan: 6000, actual: 5700, gap: -300, pct: 95 },
    { segment: 'AMS1 OSP', plan: 4000, actual: 3850, gap: -150, pct: 96 },
    { segment: 'AMS2 In-house', plan: 5000, actual: 4250, gap: -750, pct: 85 },
    { segment: 'AMS2 OSP', plan: 3500, actual: 2950, gap: -550, pct: 84 },
  ];

  const productPerformance = [
    { code: 'FG-1001', desc: 'Runner 1.5 Ton - Model X', category: 'AMS1', source: 'In-house', plan: 500, actual: 490, gap: -10, pct: 98, color: 'bg-emerald-500' },
    { code: 'FG-1002', desc: 'Runner 1.0 Ton - Model Y', category: 'AMS1', source: 'OSP', plan: 420, actual: 410, gap: -10, pct: 98, color: 'bg-emerald-500' },
    { code: 'FG-2001', desc: 'Repeater 2.0 Ton - Model Z', category: 'AMS2', source: 'In-house', plan: 600, actual: 480, gap: -120, pct: 80, color: 'bg-red-500' },
    { code: 'FG-2002', desc: 'Repeater 1.5 Ton - Model A', category: 'AMS2', source: 'OSP', plan: 550, actual: 430, gap: -120, pct: 78, color: 'bg-red-500' },
    { code: 'FG-2003', desc: 'Stranger 2.5 Ton - Model B', category: 'AMS2', source: 'OSP', plan: 700, actual: 560, gap: -140, pct: 80, color: 'bg-red-500' },
    { code: 'FG-1003', desc: 'Runner 0.5 Ton - Model C', category: 'AMS1', source: 'In-house', plan: 480, actual: 460, gap: -20, pct: 96, color: 'bg-emerald-500' },
    { code: 'FG-1004', desc: 'Runner 2.0 Ton - Model D', category: 'AMS1', source: 'OSP', plan: 380, actual: 360, gap: -20, pct: 95, color: 'bg-emerald-500' },
    { code: 'FG-2004', desc: 'Additional Runner 1.0 Ton - Model E', category: 'AMS2', source: 'In-house', plan: 450, actual: 370, gap: -80, pct: 82, color: 'bg-red-500' },
    { code: 'FG-2005', desc: 'Stranger 1.0 Ton - Model F', category: 'AMS2', source: 'OSP', plan: 420, actual: 340, gap: -80, pct: 81, color: 'bg-red-500' },
    { code: 'FG-2006', desc: 'Repeater 0.5 Ton - Model G', category: 'AMS2', source: 'In-house', plan: 360, actual: 310, gap: -50, pct: 86, color: 'bg-amber-500' },
  ];

  const topGaps = [
    { code: 'FG-2003', gap: -140, pct: 100 },
    { code: 'FG-2002', gap: -120, pct: 85.7 },
    { code: 'FG-2001', gap: -120, pct: 85.7 },
    { code: 'FG-2008', gap: -120, pct: 85.7 },
    { code: 'FG-2011', gap: -95, pct: 67.8 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-6 py-2 border-b shrink-0 bg-white border-slate-200"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/pes')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to PES Overview
          </button>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight uppercase leading-none">
            PLANNING &amp; EXECUTION CONTROL TOWER
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Apr 20 – Apr 26, 2026 (WTD)
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <CircleHelp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel scroll container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        
        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                WTD Production Plan vs Actuals
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Product-wise performance categorized by AMS1/2 and In-house / OSP
            </p>
          </div>
          <button className="flex items-center gap-1.5 border border-slate-300 bg-white rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Funnel className="w-3.5 h-3.5 text-slate-400" /> Filter
          </button>
        </div>

        {/* KPIs row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 flex items-center gap-4 px-5 py-4 shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-50">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">WTD Plan</div>
              <div className="text-2xl font-bold leading-tight text-blue-600">18,500</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Units</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 flex items-center gap-4 px-5 py-4 shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-emerald-50">
              <Factory className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">WTD Actuals</div>
              <div className="text-2xl font-bold leading-tight text-emerald-600">16,750</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Units</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 flex items-center gap-4 px-5 py-4 shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-amber-50">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Achievement</div>
              <div className="text-2xl font-bold leading-tight text-amber-600 font-mono">90.5%</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">vs Plan</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 flex items-center gap-4 px-5 py-4 shadow-sm">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-red-50">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Shortfall</div>
              <div className="text-2xl font-bold leading-tight text-red-600">1,750</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Units</div>
            </div>
          </div>
        </div>

        {/* Intermediate metrics row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700">AMS Performance Summary (WTD)</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-250 p-3 bg-emerald-50/30">
                <div className="text-xs font-bold mb-2 text-emerald-800">AMS1 <span className="font-normal text-slate-400">(RUNNER)</span></div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-400">Plan</div>
                    <div className="text-sm font-bold text-slate-800">10,000</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Actual</div>
                    <div className="text-sm font-bold text-slate-800">9,550</div>
                  </div>
                </div>
                <div className="text-base font-bold text-emerald-800">95.5%</div>
                <div className="text-[9px] text-slate-400 mb-2">Achievement</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-semibold text-emerald-700">Healthy</span>
                </div>
              </div>

              <div className="rounded-lg border border-red-250 p-3 bg-red-50/30">
                <div className="text-xs font-bold mb-2 text-red-800">AMS2 <span className="font-normal text-slate-400 text-[9px]">(REPEATER, STRANGER...)</span></div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-400">Plan</div>
                    <div className="text-sm font-bold text-slate-800">8,500</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Actual</div>
                    <div className="text-sm font-bold text-slate-800">7,200</div>
                  </div>
                </div>
                <div className="text-base font-bold text-red-800">84.7%</div>
                <div className="text-[9px] text-slate-400 mb-2">Achievement</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span className="text-[10px] font-semibold text-red-700">At Risk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700">Production Source Performance (WTD)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-semibold">
                    <th className="pb-2 text-left">Segment</th>
                    <th className="pb-2 text-right">Plan (Units)</th>
                    <th className="pb-2 text-right">Actual (Units)</th>
                    <th className="pb-2 text-right">Gap (Units)</th>
                    <th className="pb-2 text-right">Achievement (%)</th>
                    <th className="pb-2 text-left pl-3">vs Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sourceData.map(s => (
                    <tr key={s.segment}>
                      <td className="py-2 font-medium text-slate-700">{s.segment}</td>
                      <td className="py-2 text-right font-mono">{s.plan.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono">{s.actual.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono font-semibold text-red-600">{s.gap}</td>
                      <td className="py-2 text-right font-mono font-bold text-slate-700">{s.pct}%</td>
                      <td className="py-2 pl-3 w-24">
                        <div className="h-1.5 rounded-full w-full bg-slate-100 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${s.pct >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Product performance & gaps grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700">Product Performance (WTD)</div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-semibold">
                    <th className="pb-2 text-left">FG Code</th>
                    <th className="pb-2 text-left">FG Description</th>
                    <th className="pb-2 text-center">Category</th>
                    <th className="pb-2 text-center">Source</th>
                    <th className="pb-2 text-right">Plan</th>
                    <th className="pb-2 text-right">Actual</th>
                    <th className="pb-2 text-right">Gap</th>
                    <th className="pb-2 text-right">Ach %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {productPerformance.map(p => (
                    <tr key={p.code} className="hover:bg-slate-50/50">
                      <td className="py-2 font-mono font-bold text-blue-700">{p.code}</td>
                      <td className="py-2 text-slate-700 truncate max-w-[150px]" title={p.desc}>{p.desc}</td>
                      <td className="py-2 text-center">
                        <span className={`px-1 rounded text-[9px] font-bold ${p.category === 'AMS1' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="py-2 text-center text-slate-500">{p.source}</td>
                      <td className="py-2 text-right font-mono">{p.plan}</td>
                      <td className="py-2 text-right font-mono">{p.actual}</td>
                      <td className="py-2 text-right font-mono font-semibold text-red-600">{p.gap}</td>
                      <td className="py-2 text-right font-mono font-bold text-slate-800">{p.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-700">Top Production Gaps (WTD)</div>
              <div className="space-y-3">
                {topGaps.map(g => (
                  <div key={g.code} className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-600 w-14 shrink-0">{g.code}</span>
                    <div className="flex-1 h-4 rounded bg-red-50 overflow-hidden">
                      <div 
                        className="h-4 rounded bg-red-500 transition-all duration-300"
                        style={{ width: `${g.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-red-600 w-20 text-right shrink-0">
                      {g.gap} Units
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Updated &bull; 10m ago</span>
              <button className="flex items-center gap-0.5 text-blue-600 hover:underline font-bold">
                View All Gaps <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlanningControlTowerPage;
