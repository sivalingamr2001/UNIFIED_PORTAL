export interface NavItem {
  name: string;
  path: string;
  iconName?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const MODULE_NAV_CONFIG: Record<string, NavSection[]> = {
  admin: [
    {
      title: 'Main',
      items: [
        { name: 'Overview', path: '/admin', iconName: 'Layers' },
      ],
    },
    {
      title: 'Masters',
      items: [
        { name: 'User Master', path: '/admin/user-master', iconName: 'Users' },
        { name: 'Role Master', path: '/admin/role-master', iconName: 'Shield' },
        { name: 'Module Master', path: '/admin/module-master', iconName: 'Layers' },
        { name: 'Menu Master', path: '/admin/menu-master', iconName: 'Menu' },
      ],
    },
    {
      title: 'Mappings',
      items: [
        { name: 'Role vs Module', path: '/admin/role-module', iconName: 'Link2' },
        { name: 'Role vs Menu', path: '/admin/role-menu', iconName: 'Link2' },
      ],
    },
    {
      title: 'Security',
      items: [
        { name: 'User Access Rights', path: '/admin/user-access-rights', iconName: 'Key' },
        { name: 'User Hierarchy', path: '/admin/user-hierarchy', iconName: 'GitBranch' },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { name: 'Portal Messages', path: '/admin/portal-messages', iconName: 'MessageSquare' },
      ],
    },
  ],
  finance: [
    {
      title: 'Masters',
      items: [
        { name: 'Ledger Master', path: '/finance/ledger-master', iconName: 'BookOpen' },
        { name: 'TDS Master', path: '/finance/tds-master', iconName: 'BookOpen' },
        { name: 'Cost Centre', path: '/finance/cost-centre', iconName: 'BookOpen' },
        { name: 'Currency Master', path: '/finance/currency-master', iconName: 'BookOpen' },
        { name: 'Bank Master', path: '/finance/bank-master', iconName: 'BookOpen' },
        { name: 'Tax Master (GST)', path: '/finance/tax-master', iconName: 'BookOpen' },
        { name: 'Budget Master', path: '/finance/budget-master', iconName: 'BookOpen' },
      ],
    },
    {
      title: 'Transactions',
      items: [
        { name: 'Journal Voucher', path: '/finance/journal-voucher', iconName: 'Receipt' },
        { name: 'Receipt Voucher', path: '/finance/receipt-voucher', iconName: 'Receipt' },
        { name: 'Payment Voucher', path: '/finance/payment-voucher', iconName: 'Receipt' },
        { name: 'Contra Voucher', path: '/finance/contra-voucher', iconName: 'Receipt' },
        { name: 'Credit Note', path: '/finance/credit-note', iconName: 'Receipt' },
        { name: 'Debit Note', path: '/finance/debit-note', iconName: 'Receipt' },
        { name: 'TDS Entry', path: '/finance/tds-entry', iconName: 'Receipt' },
        { name: 'GST Entry', path: '/finance/gst-entry', iconName: 'Receipt' },
      ],
    },
    {
      title: 'Reports',
      items: [
        { name: 'Trial Balance', path: '/finance/trial-balance', iconName: 'ChartColumn' },
        { name: 'Balance Sheet', path: '/finance/balance-sheet', iconName: 'ChartColumn' },
        { name: 'Profit & Loss', path: '/finance/profit-loss', iconName: 'ChartColumn' },
        { name: 'Ledger Report', path: '/finance/ledger-report', iconName: 'ChartColumn' },
        { name: 'Bank Book', path: '/finance/bank-book', iconName: 'ChartColumn' },
        { name: 'Cash Book', path: '/finance/cash-book', iconName: 'ChartColumn' },
        { name: 'Day Book', path: '/finance/day-book', iconName: 'ChartColumn' },
        { name: 'TDS Report', path: '/finance/tds-report', iconName: 'ChartColumn' },
        { name: 'GST Summary', path: '/finance/gst-summary', iconName: 'ChartColumn' },
        { name: 'Aged Receivables', path: '/finance/aged-receivables', iconName: 'ChartColumn' },
        { name: 'Aged Payables', path: '/finance/aged-payables', iconName: 'ChartColumn' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { name: 'Financial Year', path: '/finance/financial-year', iconName: 'Settings' },
        { name: 'Voucher Types', path: '/finance/voucher-types', iconName: 'Settings' },
        { name: 'Numbering Series', path: '/finance/numbering-series', iconName: 'Settings' },
        { name: 'Period Closing', path: '/finance/period-closing', iconName: 'Settings' },
      ],
    },
  ],
  pes: [
    {
      title: 'Dashboards',
      items: [
        { name: 'Overview Dashboard', path: '/pes', iconName: 'LayoutDashboard' },
        { name: 'Planning & Execution Control Tower', path: '/pes/control-tower', iconName: 'LayoutDashboard' },
        { name: 'Product Custodian Portfolio', path: '/pes/product-custodian', iconName: 'LayoutDashboard' },
      ],
    },
    {
      title: "KPI's",
      items: [
        { name: 'OCQ Completion', path: '/pes/kpi-ocq', iconName: 'ChartColumn' },
        { name: 'On-Time Delivery', path: '/pes/kpi-otd', iconName: 'ChartColumn' },
        { name: 'Customer Rejection PPM', path: '/pes/kpi-rejection', iconName: 'ChartColumn' },
        { name: 'Fill Rate', path: '/pes/kpi-fill-rate', iconName: 'ChartColumn' },
      ],
    },
    {
      title: 'Alerts',
      items: [
        { name: 'Active Alerts', path: '/pes/alerts-active', iconName: 'CircleAlert' },
        { name: 'Alert History', path: '/pes/alerts-history', iconName: 'CircleAlert' },
        { name: 'Alert Configuration', path: '/pes/alerts-config', iconName: 'CircleAlert' },
      ],
    },
    {
      title: 'Transactions',
      items: [
        { name: 'Branch Planner', path: '/pes/branch-planner', iconName: 'FileText' },
        { name: 'HO Planner', path: '/pes/ho-planner', iconName: 'FileText' },
        { name: 'Demand Forecast', path: '/pes/demand-forecast', iconName: 'FileText' },
        { name: 'Replenishment Orders', path: '/pes/replenishment-orders', iconName: 'FileText' },
      ],
    },
  ],
  dms: [
    {
      title: 'Documents',
      items: [
        { name: 'All Documents', path: '/dms', iconName: 'FileText' },
        { name: 'Drafts', path: '/dms/drafts', iconName: 'FileText' },
        { name: 'Approved', path: '/dms/approved', iconName: 'FileText' },
        { name: 'Archived', path: '/dms/archived', iconName: 'FileText' },
      ],
    },
    {
      title: 'Workflow',
      items: [
        { name: 'Revision Control', path: '/dms/revision-control', iconName: 'TrendingUp' },
        { name: 'Workflow Templates', path: '/dms/templates', iconName: 'TrendingUp' },
      ],
    },
  ],
  scm: [
    {
      title: 'Procurement',
      items: [
        { name: 'Purchase Orders', path: '/scm', iconName: 'ShoppingCart' },
        { name: 'Vendor Management', path: '/scm/vendors', iconName: 'ShoppingCart' },
        { name: 'RFQ Management', path: '/scm/rfqs', iconName: 'ShoppingCart' },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { name: 'Stock Levels', path: '/scm/stock-levels', iconName: 'Package' },
        { name: 'Movements', path: '/scm/movements', iconName: 'Package' },
        { name: 'Valuation', path: '/scm/valuation', iconName: 'Package' },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Supply Analytics', path: '/scm/analytics', iconName: 'ChartColumn' },
      ],
    },
  ],
  mes: [
    {
      title: 'Production',
      items: [
        { name: 'Shop Floor Dashboard', path: '/mes', iconName: 'Factory' },
        { name: 'Shop Floor Control', path: '/mes/shop-floor', iconName: 'Factory' },
        { name: 'Job Dispatching', path: '/mes/dispatch', iconName: 'Factory' },
        { name: 'Machine Monitoring', path: '/mes/machines', iconName: 'Factory' },
      ],
    },
    {
      title: 'Quality & Downtime',
      items: [
        { name: 'Defect Logging', path: '/mes/defects', iconName: 'Shield' },
        { name: 'Work Center Downtime', path: '/mes/downtime', iconName: 'Shield' },
      ],
    },
  ],
  pms: [
    {
      title: 'Performance',
      items: [
        { name: 'Performance Overview', path: '/pms', iconName: 'TrendingUp' },
        { name: 'Department KPIs', path: '/pms/dept-kpis', iconName: 'TrendingUp' },
        { name: 'Individual Goals', path: '/pms/goals', iconName: 'TrendingUp' },
        { name: 'Efficiency Index', path: '/pms/efficiency', iconName: 'TrendingUp' },
      ],
    },
  ],
  'pes-lite': [
    {
      title: 'Custodians',
      items: [
        { name: 'PES Lite Dashboard', path: '/pes-lite', iconName: 'Zap' },
        { name: 'Product Custodian', path: '/pes-lite/product-custodian', iconName: 'Package' },
        { name: 'Commodity Custodian', path: '/pes-lite/commodity-custodian', iconName: 'Cpu' },
      ],
    },
  ],
};
