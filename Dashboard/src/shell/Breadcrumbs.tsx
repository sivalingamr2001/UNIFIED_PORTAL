import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useDatabase } from '../shared/hooks/useDatabase';

const pathMap: Record<string, string> = {
  'admin': 'Admin',
  'user-master': 'User Master',
  'role-master': 'Role Master',
  'module-master': 'Module Master',
  'menu-master': 'Menu Master',
  'role-module': 'Role vs Module Mapping',
  'role-menu': 'Role vs Menu Mapping',
  'user-access-rights': 'User Access Rights',
  'user-hierarchy': 'User Hierarchy',
  'finance': 'Finance',
  'ledger-master': 'Ledger Master',
  'tds-master': 'TDS Master',
  'cost-centre': 'Cost Centre',
  'currency-master': 'Currency Master',
  'bank-master': 'Bank Master',
  'tax-master': 'Tax Master (GST)',
  'budget-master': 'Budget Master',
  'journal-voucher': 'Journal Voucher',
  'receipt-voucher': 'Receipt Voucher',
  'payment-voucher': 'Payment Voucher',
  'contra-voucher': 'Contra Voucher',
  'credit-note': 'Credit Note',
  'debit-note': 'Debit Note',
  'tds-entry': 'TDS Entry',
  'gst-entry': 'GST Entry',
  'trial-balance': 'Trial Balance',
  'balance-sheet': 'Balance Sheet',
  'profit-loss': 'Profit & Loss',
  'ledger-report': 'Ledger Report',
  'bank-book': 'Bank Book',
  'cash-book': 'Cash Book',
  'day-book': 'Day Book',
  'tds-report': 'TDS Report',
  'gst-summary': 'GST Summary',
  'aged-receivables': 'Aged Receivables',
  'aged-payables': 'Aged Payables',
  'financial-year': 'Financial Year Settings',
  'voucher-types': 'Voucher Types Config',
  'numbering-series': 'Numbering Series Config',
  'period-closing': 'Period Closing Settings',
  'pes': 'PES',
  'control-tower': 'Planning & Execution Control Tower',
  'product-custodian': 'Product Custodian Portfolio',
  'kpi-ocq': 'OCQ Completion',
  'kpi-otd': 'On-Time Delivery',
  'kpi-rejection': 'Customer Rejection PPM',
  'kpi-fill-rate': 'Fill Rate',
  'alerts-active': 'Active Alerts',
  'alerts-history': 'Alert History',
  'alerts-config': 'Alert Configuration',
  'branch-planner': 'Branch Planner',
  'ho-planner': 'HO Planner',
  'demand-forecast': 'Demand Forecast',
  'replenishment-orders': 'Replenishment Orders',
  'dms': 'DMS',
  'drafts': 'Draft Documents',
  'approved': 'Approved Documents',
  'archived': 'Archived Documents',
  'revision-control': 'Revision Control',
  'templates': 'Workflow Templates',
  'scm': 'SCM',
  'vendors': 'Vendor Management',
  'rfqs': 'RFQ Management',
  'stock-levels': 'Stock Levels',
  'movements': 'Stock Movements',
  'valuation': 'Stock Valuation',
  'analytics': 'Supply Analytics',
  'mes': 'MES',
  'shop-floor': 'Shop Floor Control',
  'dispatch': 'Job Dispatching',
  'machines': 'Machine Monitoring',
  'defects': 'Defect Logging',
  'downtime': 'Work Center Downtime',
  'pms': 'PMS',
  'dept-kpis': 'Department KPIs',
  'goals': 'Individual Goals',
  'efficiency': 'Efficiency Index',
  'pes-lite': 'PES Lite',
  'planning': 'Planning Overview',
  'execution': 'Quick Execution',
};

export const Breadcrumbs: React.FC = () => {
  const { getMessage } = useDatabase();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getLabel = (part: string) => {
    const staticLabel = pathMap[part] || part.charAt(0).toUpperCase() + part.slice(1);
    return getMessage(staticLabel);
  };

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
      <Link 
        to="/" 
        className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.length > 0 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={to}>
            {isLast ? (
              <span className="text-slate-800 font-bold max-w-[150px] sm:max-w-none truncate">
                {getLabel(value)}
              </span>
            ) : (
              <>
                <Link 
                  to={to} 
                  className="text-slate-400 hover:text-slate-700 transition-colors truncate max-w-[120px]"
                >
                  {getLabel(value)}
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
