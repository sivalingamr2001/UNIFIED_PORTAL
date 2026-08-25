import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, ChevronDown, Calendar, Funnel, Box, Package, Info, TriangleAlert, ShieldCheck } from 'lucide-react';

export const ProductCustodianDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const dummyAlerts = [
    { id: 'PC-AL-001', title: 'Runner FG below OCQ for next 2 weeks', severity: 'Critical', age: '2h 15m', status: 'New', sevColor: 'bg-red-50 text-red-700 border-red-300' },
    { id: 'PC-AL-002', title: 'Customer rejection ppm above plan', severity: 'High', age: '5h 40m', status: 'New', sevColor: 'bg-orange-50 text-orange-700 border-orange-300' },
    { id: 'PC-AL-003', title: 'AMS2 delivery backlog > 2 weeks', severity: 'Medium', age: '1d 2h', status: 'In Progress', sevColor: 'bg-amber-50 text-amber-700 border-amber-300' },
  ];

  const deliveryData = [
    { metric: 'AMS1 – Fixed Plan (OCQ)', plan: 1000, actual: 920, pct: 92, variance: -80, varPct: -8, status: 'On Track', color: 'bg-emerald-500' },
    { metric: 'AMS1 – Buffer Replenishment Plan', plan: 200, actual: 180, pct: 90, variance: -20, varPct: -10, status: 'On Track', color: 'bg-emerald-500' },
    { metric: 'AMS2 – OCQ (Plan)', plan: 800, actual: 760, pct: 95, variance: -40, varPct: -5, status: 'On Track', color: 'bg-emerald-500' },
    { metric: 'M2O – Plan', plan: 320, actual: 315, pct: 98, variance: -5, varPct: -2, status: 'On Track', color: 'bg-emerald-500' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Subheader status bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/pes')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase leading-none">
                PORTFOLIO DASHBOARD – <span className="text-blue-600">PRODUCT CUSTODIAN</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Real-time view of custodian portfolio, alerts and performance.</p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Last updated: May 24, 2026 09:00 AM
            </div>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-500">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <button className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            MTD (May 1 – May 24, 2026)
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 shadow-sm">
            <Funnel className="w-3.5 h-3.5 text-slate-400" />
            All Plants
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Panel scroll container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          
          {/* Card 1: Product Portfolio */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[12px] font-bold text-slate-800 tracking-wide uppercase">
                <span className="text-blue-600">1)</span> MY PRODUCT PORTFOLIO
              </h2>
              <button title="Your assigned product groups across all AMSs" className="text-slate-400 hover:text-slate-600">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-blue-200 p-3.5 flex flex-col gap-2.5 bg-blue-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">AMS1</span>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center bg-blue-100 border border-blue-200">
                    <Box className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-xs font-semibold text-slate-700">Runner (18)</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sample Products</span>
                  <div className="mt-1 flex flex-col gap-0.5 font-mono text-[10px] text-slate-600">
                    <div>FG-1001 &bull; Hydraulic Cylinder</div>
                    <div>FG-1002 &bull; Air Valve</div>
                    <div>FG-1003 &bull; Regulator</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-orange-200 p-3.5 flex flex-col gap-2.5 bg-orange-50/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">AMS2</span>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center bg-orange-100 border border-orange-200">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Runner (4)
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Repeater (9)
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Stranger (6)
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sample Products</span>
                  <div className="mt-1 flex flex-col gap-0.5 font-mono text-[10px] text-slate-600">
                    <div>FG-2001 &bull; Solenoid Coil</div>
                    <div>FG-2002 &bull; Mounting Kit</div>
                    <div>FG-2003 &bull; Piston Rod</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Active Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-slate-800 tracking-wide uppercase">
                <span className="text-blue-600">2)</span> ACTIVE ALERTS
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase">requires attention</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-semibold">
                    <th className="pb-2">Alert ID</th>
                    <th className="pb-2">Alert Title</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Ageing</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dummyAlerts.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-mono font-bold text-blue-700">{a.id}</td>
                      <td className="py-2.5 font-medium text-slate-700 truncate max-w-[180px]">{a.title}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${a.sevColor}`}>
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-[10px] text-slate-500">{a.age}</td>
                      <td className="py-2.5 text-center">
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-slate-100 text-slate-600 border font-semibold">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">1 Critical</span>
              <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-bold border border-orange-200">1 High</span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-200">1 Medium</span>
            </div>
          </div>
        </div>

        {/* Card 3: Delivery Performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-[12px] font-bold text-slate-800 tracking-wide uppercase">
            <span className="text-blue-600">3)</span> DELIVERY PERFORMANCE (MTD)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-2.5">Metric Plan Category</th>
                  <th className="p-2.5 text-right">Plan (EA)</th>
                  <th className="p-2.5 text-right">Actual (EA)</th>
                  <th className="p-2.5">Completion Rate</th>
                  <th className="p-2.5 text-right">Variance</th>
                  <th className="p-2.5 text-right">Var %</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveryData.map(d => (
                  <tr key={d.metric} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-800">{d.metric}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-600">{d.plan.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-blue-700">{d.actual.toLocaleString()}</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <span className="w-8 text-right font-bold text-slate-700">{d.pct}%</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-red-600">{d.variance}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-red-600">{d.varPct}%</td>
                    <td className="p-2.5 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 4: Quality Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-[12px] font-bold text-slate-800 tracking-wide uppercase">
              <span className="text-blue-600">4)</span> QUALITY PERFORMANCE (MTD)
            </h2>
            <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-200 rounded-lg bg-slate-50/50 p-4">
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight mb-2">Target Limit (PPM)</span>
                <span className="text-2xl font-black text-slate-800 font-mono">500</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight mb-2">Actual Rate (PPM)</span>
                <span className="text-2xl font-black text-blue-600 font-mono">320</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-tight mb-2">Rejection Variance</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">-180</span>
              </div>
            </div>
            <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              Lower customer rejections PPM than standard targets is compliant with ISO 9001 guidelines.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-700">Audit Status</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ISO audit runs are mapping next week. Review Quality procedures, and ensure that all specifications documents are up to date inside the DMS vault.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-4">
              <TriangleAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Next external audit: Aug 12, 2026
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCustodianDashboardPage;
