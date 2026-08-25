import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const navigate = useNavigate();

  const dummyVouchers = [
    { id: 'JV-2026-001', date: '2026-08-19', ledger: 'Cash Account', type: 'Receipt', amount: 45000, status: 'Posted' },
    { id: 'JV-2026-002', date: '2026-08-18', ledger: 'Acme Materials Corp', type: 'Payment', amount: 120000, status: 'Posted' },
    { id: 'JV-2026-003', date: '2026-08-18', ledger: 'Office Rent Ledger', type: 'Debit Note', amount: 35000, status: 'Pending Approval' },
    { id: 'JV-2026-042', date: '2026-08-17', ledger: 'HDFC Bank Main Acc', type: 'Contra', amount: 800000, status: 'Posted' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subheader status bar */}
      <div 
        className="flex items-center justify-between px-4 py-1.5 border-b shrink-0" 
        style={{ background: 'rgb(248, 250, 252)', borderColor: 'rgb(232, 238, 248)' }}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Finance Module</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">Ledger accounting &amp; tax compliance</span>
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600 border border-teal-200">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Finance Overview</h1>
            <p className="text-[10px] text-slate-400 mt-1">Financial Accounting &amp; Reporting</p>
          </div>
        </div>

        {/* Finance KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Total Receivables</span>
            <span className="text-2xl font-bold text-slate-900">$245,800</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12% increase this quarter
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">Pending Approvals</span>
            <span className="text-2xl font-bold text-amber-700">12 Vouchers</span>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> 3 vouchers overdue
            </span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-bold">System Health</span>
            <span className="text-2xl font-bold text-teal-700">99.9%</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> GST tax mapping complete
            </span>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold">
              Recent Journal Entries
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">Live view</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-2.5">Voucher ID</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Accounts Ledger</th>
                  <th className="p-2.5">Voucher Type</th>
                  <th className="p-2.5 text-right">Amount</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyVouchers.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono font-bold text-blue-700">{v.id}</td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-500">{v.date}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{v.ledger}</td>
                    <td className="p-2.5">{v.type}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-700">
                      ${v.amount.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        v.status === 'Posted' ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300' : 'bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                      }`}>
                        {v.status}
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

export default FinancePage;
