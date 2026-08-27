import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import AppShell from '../shell/AppShell';
import { useAuth } from '../features/auth/useAuth';
import { MODULE_NAV_CONFIG } from '../shell/Sidebar/nav-config';

// Lazy loading feature pages
const LoginPage = React.lazy(() => import('../features/auth/LoginPage'));
const PortalDashboardPage = React.lazy(() => import('../features/portal/PortalDashboardPage'));

// Admin Module Pages
const AdminLayout = React.lazy(() => import('../features/admin/AdminLayout'));
const AdminOverviewPage = React.lazy(() => import('../features/admin/OverviewPage'));
const UserMasterPage = React.lazy(() => import('../features/admin/UserMasterPage'));
const RoleMasterPage = React.lazy(() => import('../features/admin/RoleMasterPage'));
const ModuleMasterPage = React.lazy(() => import('../features/admin/ModuleMasterPage'));
const MenuMasterPage = React.lazy(() => import('../features/admin/MenuMasterPage'));
const RoleModulePage = React.lazy(() => import('../features/admin/RoleVsModulePage'));
const RoleMenuPage = React.lazy(() => import('../features/admin/RoleVsMenuPage'));
const UserAccessRightsPage = React.lazy(() => import('../features/admin/UserAccessRightsPage'));
const UserHierarchyPage = React.lazy(() => import('../features/admin/UserHierarchyPage'));
const PortalMessagesPage = () => (
  <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
    <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">Portal Messages</h2>
    <p className="text-xs text-slate-500">This feature is currently under construction.</p>
  </div>
);


// Other Module Pages
const FinancePage = React.lazy(() => import('../features/finance/FinancePage'));
const ScmPage = React.lazy(() => import('../features/scm/ScmPage'));
const MesPage = React.lazy(() => import('../features/mes/MesPage'));
const PmsPage = React.lazy(() => import('../features/pms/PmsPage'));
const DmsPage = React.lazy(() => import('../features/dms/DmsPage'));
const PesLitePage = React.lazy(() => import('../features/pes-lite/PesLitePage'));
const ProductCustodianApp = React.lazy(() => import('../features/pes-lite/product-custodian/ProductCustodianApp'));
const CommodityCustodianApp = React.lazy(() => import('../features/pes-lite/commodity-custodian/CommodityCustodianApp'));

// PES Module Pages
const PesDashboardPage = React.lazy(() => import('../features/pes/dashboard/PesDashboardPage'));
const PlanningControlTowerPage = React.lazy(() => import('../features/pes/control-tower/PlanningControlTowerPage'));
const ProductCustodianDashboardPage = React.lazy(() => import('../features/pes/product-custodian/ProductCustodianDashboardPage'));

// Suspense Loader Fallback
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      <p className="text-xs font-medium text-slate-400">Loading section...</p>
    </div>
  </div>
);


const ModuleRouteGuard: React.FC<{ module: string; children: React.ReactNode }> = ({ module, children }) => {
  const { isPermittedModule } = useAuth();

  if (!isPermittedModule(module)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

// Access Denied Page
const AccessDenied: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6">
    <div className="max-w-md text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
        ⚠️
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Access Denied</h2>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Your current user role or permission matrix does not authorize access to this module. Please contact your system administrator.
      </p>
      <LinkButton to="/" label="Back to Dashboard" />
    </div>
  </div>
);

// Page Not Found Page
const PageNotFound: React.FC = () => (
  <div className="flex-1 bg-[#f0f4f8]" />
);

const featurePagesGlob = import.meta.glob('../features/**/*.tsx');

const DynamicFeatureLoader: React.FC<{ module: string }> = ({ module }) => {
  const { pathname } = useLocation();
  const { '*': subpath } = useParams();

  // Handle module overview page (index)
  if (!subpath || subpath === '') {
    let ModuleIndexPage;
    if (module === 'finance') ModuleIndexPage = React.lazy(() => import('../features/finance/FinancePage'));
    else if (module === 'scm') ModuleIndexPage = React.lazy(() => import('../features/scm/ScmPage'));
    else if (module === 'mes') ModuleIndexPage = React.lazy(() => import('../features/mes/MesPage'));
    else if (module === 'pms') ModuleIndexPage = React.lazy(() => import('../features/pms/PmsPage'));
    else if (module === 'dms') ModuleIndexPage = React.lazy(() => import('../features/dms/DmsPage'));
    else return <div className="flex-1 bg-[#f0f4f8]" />;

    return (
      <Suspense fallback={<PageLoader />}>
        <ModuleIndexPage />
      </Suspense>
    );
  }

  // Find name from config
  let name = '';
  for (const mod in MODULE_NAV_CONFIG) {
    for (const section of MODULE_NAV_CONFIG[mod]) {
      const match = section.items.find(item => {
        const cleanPath = pathname.replace(/^\/pes_lite/, '');
        return item.path === cleanPath || item.path === pathname;
      });
      if (match) {
        name = match.name;
        break;
      }
    }
    if (name) break;
  }

  if (!name && subpath) {
    name = subpath.split('/').pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Page';
  }

  const lastSegment = subpath.split('/').pop() || '';
  const componentName = lastSegment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Page';
  const filePath = `../features/${module}/${componentName}.tsx`;
  const importer = featurePagesGlob[filePath];

  if (!importer) {
    return (
      <div className="flex-1 flex flex-col bg-[#f0f4f8] p-5 justify-center items-center">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-md text-center">
          <h2 className="text-sm font-bold text-slate-900 mb-2">{name}</h2>
          <p className="text-xs text-slate-500">This section is currently under construction.</p>
        </div>
      </div>
    );
  }

  const LazyComponent = React.lazy(importer as any);

  return (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>
  );
};

const LinkButton: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = window.location.pathname.startsWith('/pes_lite/') ? '/pes_lite' + to : to;
  };
  return (
    <a
      href={to}
      onClick={handleClick}
      className="inline-block bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
    >
      {label}
    </a>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <PortalDashboardPage />
          </Suspense>
        ),
      },
      // Admin Layout Group
      {
        path: 'admin',
        element: (
          <ModuleRouteGuard module="admin">
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </ModuleRouteGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminOverviewPage />
              </Suspense>
            ),
          },
          {
            path: 'user-master',
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserMasterPage />
              </Suspense>
            ),
          },
          {
            path: 'role-master',
            element: (
              <Suspense fallback={<PageLoader />}>
                <RoleMasterPage />
              </Suspense>
            ),
          },
          {
            path: 'module-master',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ModuleMasterPage />
              </Suspense>
            ),
          },
          {
            path: 'menu-master',
            element: (
              <Suspense fallback={<PageLoader />}>
                <MenuMasterPage />
              </Suspense>
            ),
          },
          {
            path: 'role-module',
            element: (
              <Suspense fallback={<PageLoader />}>
                <RoleModulePage />
              </Suspense>
            ),
          },
          {
            path: 'role-menu',
            element: (
              <Suspense fallback={<PageLoader />}>
                <RoleMenuPage />
              </Suspense>
            ),
          },
          {
            path: 'user-access-rights',
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserAccessRightsPage />
              </Suspense>
            ),
          },
          {
            path: 'user-hierarchy',
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserHierarchyPage />
              </Suspense>
            ),
          },
          {
            path: 'portal-messages',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PortalMessagesPage />
              </Suspense>
            ),
          },
        ],
      },
      // Finance Module
      {
        path: 'finance/*',
        element: (
          <ModuleRouteGuard module="finance">
            <Suspense fallback={<PageLoader />}>
              <FinancePage />
            </Suspense>
          </ModuleRouteGuard>
        ),
      },
      // SCM Module
      {
        path: 'scm/*',
        element: (
          <ModuleRouteGuard module="scm">
            <Suspense fallback={<PageLoader />}>
              <ScmPage />
            </Suspense>
          </ModuleRouteGuard>
        ),
      },
      // MES Module
      {
        path: 'mes/*',
        element: (
          <ModuleRouteGuard module="mes">
            <Suspense fallback={<PageLoader />}>
              <MesPage />
            </Suspense>
          </ModuleRouteGuard>
        ),
      },
      // PMS Module
      {
        path: 'pms/*',
        element: (
          <ModuleRouteGuard module="pms">
            <Suspense fallback={<PageLoader />}>
              <PmsPage />
            </Suspense>
          </ModuleRouteGuard>
        ),
      },
      // DMS Module
      {
        path: 'dms/*',
        element: (
          <ModuleRouteGuard module="dms">
            <Suspense fallback={<PageLoader />}>
              <DmsPage />
            </Suspense>
          </ModuleRouteGuard>
        ),
      },
      // PES Lite Module
      {
        path: 'pes-lite',
        element: (
          <ModuleRouteGuard module="pes-lite">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ModuleRouteGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PesLitePage />
              </Suspense>
            ),
          },
          {
            path: 'product-custodian',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProductCustodianApp />
              </Suspense>
            ),
          },
          {
            path: 'commodity-custodian',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CommodityCustodianApp />
              </Suspense>
            ),
          },
        ],
      },
      // PES Module
      {
        path: 'pes',
        element: (
          <ModuleRouteGuard module="pes">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ModuleRouteGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PesDashboardPage />
              </Suspense>
            ),
          },
          {
            path: 'control-tower',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PlanningControlTowerPage />
              </Suspense>
            ),
          },
          {
            path: 'product-custodian',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProductCustodianDashboardPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'access-denied',
        element: <AccessDenied />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
], {
  basename: '/pes_lite'
});
