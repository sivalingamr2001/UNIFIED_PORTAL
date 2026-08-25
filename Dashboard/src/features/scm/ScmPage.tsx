import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, PackageOpen, AlertTriangle } from 'lucide-react';

export const ScmPage: React.FC = () => {
  const navigate = useNavigate();

  const dummyPurchaseOrders = [
    { poNum: 'PO-SCM-109', supplier: 'TechParts Asia Ltd', date: '2026-08-19', amount: 350000, status: 'Released' },
    { poNum: 'PO-SCM-108', supplier: 'Amebearing Corp', date: '2026-08-18', amount: 15400, status: 'Under Review' },
    { poNum: 'PO-SCM-107', supplier: 'Standard Castings Inc', date: '2026-08-15', amount: 142000, status: 'Fully Received' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" 
        style={{ background: 'rgb(248, 250, 252)', borderColor: 'rgb(232, 238, 248)' }}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">SCM Module</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Supply Chain, PO Release &amp; Vendors</span>
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600 border border-orange-200">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Supply Chain Management</h1>
            <p className="text-[10px] text-slate-400 mt-1">Vendor Procurement &amp; Inventory movement</p>
          </div>
        </div>

        {/* SCM KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Active Purchase Orders</span>
            <span className="text-2xl font-bold text-slate-900">42 Orders</span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              Total committed: $674K
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Low Stock alerts</span>
            <span className="text-2xl font-bold text-red-700">3 SKUs</span>
            <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Reorder limits breached
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">On-Time Supplier Delivery</span>
            <span className="text-2xl font-bold text-emerald-700">97.8%</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <PackageOpen className="w-3.5 h-3.5" /> Exceeds target SLA (95%)
            </span>
          </div>
        </div>

        {/* PO Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold mb-3">
            Open Supplier PO Registry
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-2.5">PO Number</th>
                  <th className="p-2.5">Vendor Supplier</th>
                  <th className="p-2.5">Release Date</th>
                  <th className="p-2.5 text-right">Commit Value</th>
                  <th className="p-2.5 text-center">Receipt Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyPurchaseOrders.map(p => (
                  <tr key={p.poNum} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono font-bold text-blue-700">{p.poNum}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{p.supplier}</td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-500">{p.date}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-700">
                      ${p.amount.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        p.status === 'Fully Received' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 
                        p.status === 'Released' ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-300' :
                        'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                      }`}>
                        {p.status}
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

export default ScmPage;
