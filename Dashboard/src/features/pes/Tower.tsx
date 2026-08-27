import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Flag,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

// Charts Mock Data
const stageVarianceData = [
  { name: 'Pre-Processing', variance: -1.2 },
  { name: 'Processing', variance: 3.1 },
  { name: 'Post-Processing', variance: -0.2 }
];

const statusPieData = [
  { name: 'On Track', value: 78, color: '#10b981' }, // Emerald-500
  { name: 'At Risk', value: 32, color: '#f59e0b' },  // Amber-500
  { name: 'Delayed', value: 18, color: '#ef4444' }   // Red-500
];

const topDelayedOSPs = [
  { name: 'OSP Sigma (Machining)', variance: 4.2, pct: 84 },
  { name: 'OSP Alpha (Heat Treat)', variance: 3.5, pct: 70 },
  { name: 'OSP Beta (Grinding)', variance: 2.8, pct: 56 },
  { name: 'OSP Gamma (Coating)', variance: 2.1, pct: 42 },
  { name: 'OSP Delta (Paint Shop)', variance: 1.6, pct: 32 }
];

export const Tower: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs">
      
      {/* Subheader status bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-none">Planning &amp; Execution Control Tower</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">OSP Jobs &bull; Multi-OSP Train Journey Monitoring</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Controls */}
          <div className="flex flex-col border border-slate-200 bg-slate-50 rounded px-2 py-0.5 min-w-[100px]">
            <span className="text-[8px] text-slate-400 font-bold uppercase">Date Range</span>
            <span className="text-[10px] font-semibold text-slate-700">Last 30 Days</span>
          </div>
          <div className="flex flex-col border border-slate-200 bg-slate-50 rounded px-2 py-0.5 min-w-[80px]">
            <span className="text-[8px] text-slate-400 font-bold uppercase">Job Type</span>
            <span className="text-[10px] font-semibold text-slate-700">All</span>
          </div>
          <div className="flex flex-col border border-slate-200 bg-slate-50 rounded px-2 py-0.5 min-w-[80px]">
            <span className="text-[8px] text-slate-400 font-bold uppercase">Product</span>
            <span className="text-[10px] font-semibold text-slate-700">All</span>
          </div>
          <button className="flex items-center gap-1 border border-blue-500 text-blue-600 rounded px-2.5 py-1 text-[10px] font-bold hover:bg-blue-50 transition-colors cursor-pointer">
            <Filter className="w-3 h-3" />
            <span>Filters</span>
          </button>
          <button className="border border-slate-200 hover:border-slate-300 rounded p-1 text-slate-500 hover:text-slate-800 transition-colors bg-white cursor-pointer">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Total OSP Jobs</div>
          <div className="text-base font-bold text-slate-900 mt-1 font-mono">128</div>
          <div className="text-[8px] text-slate-400 mt-0.5">Across all stages</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase text-emerald-600">On Track</div>
          <div className="text-base font-bold text-emerald-600 mt-1 font-mono">78</div>
          <div className="text-[8px] text-emerald-500 font-semibold mt-0.5">61% of total</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase text-amber-600">At Risk</div>
          <div className="text-base font-bold text-amber-600 mt-1 font-mono">32</div>
          <div className="text-[8px] text-amber-500 font-semibold mt-0.5">25% of total</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase text-red-600">Delayed</div>
          <div className="text-base font-bold text-red-600 mt-1 font-mono">18</div>
          <div className="text-[8px] text-red-500 font-semibold mt-0.5">14% of total</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Avg Plan TAT</div>
          <div className="text-base font-bold text-slate-900 mt-1 font-mono">18.6</div>
          <div className="text-[8px] text-slate-400 mt-0.5">Days</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase">Avg Actual TAT</div>
          <div className="text-base font-bold text-slate-900 mt-1 font-mono">20.3</div>
          <div className="text-[8px] text-slate-400 mt-0.5">Days</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase text-red-600">Avg Variance</div>
          <div className="text-base font-bold text-red-600 mt-1 font-mono">+1.7</div>
          <div className="text-[8px] text-red-500 mt-0.5">Days Delayed</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm text-center">
          <div className="text-[9px] font-bold text-slate-400 uppercase text-emerald-600">On-time Comp</div>
          <div className="text-base font-bold text-slate-900 mt-1 font-mono">62%</div>
          <div className="text-[8px] text-emerald-600 font-semibold mt-0.5">+5% vs Prior Mo.</div>
        </div>
      </div>

      {/* Multi-OSP Train Journey Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Multi-OSP Train Journey &mdash; Job Pipelines</h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> On Track
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> At Risk
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Delayed
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[9px] uppercase tracking-widest text-slate-600 font-bold">
                <th className="px-3 py-2.5 text-left w-36">Job Info</th>
                <th className="px-3 py-2.5 text-center w-14">Total OSPs</th>
                <th className="px-3 py-2.5 text-center w-16">Plan TAT</th>
                <th className="px-3 py-2.5 text-center w-16">Actual TAT</th>
                <th className="px-3 py-2.5 text-center w-16">Variance</th>
                <th className="px-3 py-2.5 text-center w-24">Overall Status</th>
                <th className="px-3 py-2.5 text-center">OSP Process Train Status (Stage 1 &rarr; Stage 4)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-blue-600">JOB-1001</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Gear Housing</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Pune Plant</div>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold font-mono">3</td>
                <td className="px-3 py-2.5 text-center font-mono">18d</td>
                <td className="px-3 py-2.5 text-center font-mono">16d</td>
                <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-600">-2d</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[9px]">On Track</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* OSP 1 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP1</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">5d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 2 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP2</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">6d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 3 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP3</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">3d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">1d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 4 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-blue-600">JOB-1002</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Shaft Assy</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Chennai Plant</div>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold font-mono">2</td>
                <td className="px-3 py-2.5 text-center font-mono">22d</td>
                <td className="px-3 py-2.5 text-center font-mono">24d</td>
                <td className="px-3 py-2.5 text-center font-mono font-bold text-red-600">+2d</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-[9px]">Delayed</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* OSP 1 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP1</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">5d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 2 */}
                    <div className="flex items-center gap-1 bg-white border border-red-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP2</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="text-[8px] font-bold font-mono leading-none">3d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        <span className="text-[8px] font-bold font-mono leading-none">7d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 3 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 4 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-blue-600">JOB-1003</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Hydraulic Rod</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Pune Plant</div>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold font-mono">4</td>
                <td className="px-3 py-2.5 text-center font-mono">28d</td>
                <td className="px-3 py-2.5 text-center font-mono">31d</td>
                <td className="px-3 py-2.5 text-center font-mono font-bold text-amber-600">+3d</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[9px]">At Risk</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* OSP 1 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP1</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">5d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 2 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP2</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">6d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 3 */}
                    <div className="flex items-center gap-1 bg-white border border-amber-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP3</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="text-[8px] font-bold font-mono leading-none">4d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">1d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 4 */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded shadow-sm opacity-50">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP4</div>
                      <div className="flex flex-col items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        <span className="text-[8px] font-bold font-mono leading-none">-</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        <span className="text-[8px] font-bold font-mono leading-none">-</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        <span className="text-[8px] font-bold font-mono leading-none">-</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-blue-600">JOB-1004</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Motor Body</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Ahmedabad Plant</div>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold font-mono">1</td>
                <td className="px-3 py-2.5 text-center font-mono">12d</td>
                <td className="px-3 py-2.5 text-center font-mono">11d</td>
                <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-600">-1d</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[9px]">Completed</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* OSP 1 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP1</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">1d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">6d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 2 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 3 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 4 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-slate-50/50">
                <td className="px-3 py-2.5">
                  <div className="font-bold text-blue-600">JOB-1005</div>
                  <div className="font-semibold text-slate-800 mt-0.5">Valve Block</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Kolkata Plant</div>
                </td>
                <td className="px-3 py-2.5 text-center font-semibold font-mono">3</td>
                <td className="px-3 py-2.5 text-center font-mono">20d</td>
                <td className="px-3 py-2.5 text-center font-mono">23d</td>
                <td className="px-3 py-2.5 text-center font-mono font-bold text-red-600">+3d</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-[9px]">Delayed</span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5 justify-center">
                    {/* OSP 1 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP1</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">5d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 2 */}
                    <div className="flex items-center gap-1 bg-white border border-emerald-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP2</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">6d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 3 */}
                    <div className="flex items-center gap-1 bg-white border border-red-200 p-1 rounded shadow-sm">
                      <div className="text-[8px] font-semibold text-slate-400 uppercase px-0.5">OSP3</div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">3d</span>
                        <span className="text-[7px] opacity-75 font-mono">Pre</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        <span className="text-[8px] font-bold font-mono leading-none">3d</span>
                        <span className="text-[7px] opacity-75 font-mono">Proc</span>
                      </div>
                      <div className="flex flex-col items-center px-1 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        <span className="text-[8px] font-bold font-mono leading-none">2d</span>
                        <span className="text-[7px] opacity-75 font-mono">Post</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    {/* OSP 4 (Not Started) */}
                    <div className="flex items-center justify-center p-2 rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <Flag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics & Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Stage Variance Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Stage Variance (Avg Days)</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageVarianceData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '6px' }} />
                <Bar dataKey="variance" fill="#3b82f6" radius={[3, 3, 0, 0]}>
                  {stageVarianceData.map((entry, index) => {
                    const color = entry.variance < 0 ? '#10b981' : '#ef4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Delayed OSPs progress indicator */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Top Delayed OSPs (by Avg Variance)</h3>
            <div className="space-y-3.5 mt-1">
              {topDelayedOSPs.map(osp => (
                <div key={osp.name} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-slate-600">{osp.name}</span>
                    <span className="font-bold text-red-600 font-mono">+{osp.variance} Days</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-1.5 bg-red-500 rounded-full transition-all"
                      style={{ width: `${osp.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Jobs by Overall Status</h3>
            <p className="text-[10px] text-slate-400 leading-normal">Overall pipelines distribution</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-28 w-28 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-bold text-slate-800 font-mono leading-none">128</span>
                <span className="text-[8px] text-slate-400 font-medium leading-none mt-0.5">Jobs</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {statusPieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="text-[10px] text-slate-500 leading-none">{item.name}</div>
                    <div className="text-[11px] font-bold text-slate-800 font-mono mt-0.5">
                      {item.value} <span className="text-[9px] text-slate-400 font-normal font-mono">({Math.round((item.value / 128) * 100)}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tower;