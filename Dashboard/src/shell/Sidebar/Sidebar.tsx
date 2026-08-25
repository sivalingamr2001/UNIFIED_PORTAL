import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { MODULE_NAV_CONFIG, type NavSection } from './nav-config';
import { useDatabase } from '../../shared/hooks/useDatabase';
import * as Icons from 'lucide-react';

// Dynamic icon resolver
const SidebarIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return <Icons.ChevronRight className={className} />;
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPermittedModule, user } = useAuth();
  const { getMessage } = useDatabase();

  // Determine active module based on path prefix
  // e.g. "/admin/user-master" -> "admin"
  // "/finance/ledger-master" -> "finance"
  const getActiveModule = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/pes-lite')) return 'pes-lite';
    if (path.startsWith('/pes')) return 'pes';
    if (path.startsWith('/dms')) return 'dms';
    if (path.startsWith('/scm')) return 'scm';
    if (path.startsWith('/mes')) return 'mes';
    if (path.startsWith('/pms')) return 'pms';
    return '';
  };

  const activeModule = getActiveModule();
  if (!activeModule) return null;
  
  const navSections = MODULE_NAV_CONFIG[activeModule] || [];

  // Check if module is allowed for active user
  const isAllowed = isPermittedModule(activeModule);

  const getModuleTitle = (mod: string) => {
    if (mod === 'pes-lite') return 'PES Lite';
    if (mod === 'pes') return 'PES';
    return mod.toUpperCase();
  };

  const getModuleColorIndicator = (mod: string) => {
    switch (mod) {
      case 'admin': return 'bg-indigo-400';
      case 'finance': return 'bg-teal-500';
      case 'pes': return 'bg-blue-600';
      case 'pes-lite': return 'bg-cyan-500';
      case 'dms': return 'bg-emerald-500';
      case 'scm': return 'bg-orange-500';
      case 'mes': return 'bg-purple-500';
      case 'pms': return 'bg-pink-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <aside 
      className="flex flex-col border-r border-slate-800 transition-all duration-200 shrink-0 w-60 text-white" 
      style={{ backgroundColor: 'rgb(15, 42, 82)' }}
    >
      {/* Module Title Badge */}
      {activeModule && (
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10 h-14 shrink-0">
          <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-white/15">
            <SidebarIcon name={activeModule === 'admin' ? 'Shield' : 'Factory'} className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate leading-tight">
              {getMessage(getModuleTitle(activeModule))} Module
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getModuleColorIndicator(activeModule)}`}></span>
              <span className="text-[9px] font-mono text-blue-300/60 uppercase tracking-wider font-semibold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tree */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4" style={{ scrollbarWidth: 'none' }}>
        {navSections.map((section: NavSection, sIdx: number) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[9px] font-bold font-mono uppercase tracking-widest text-blue-300/40">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item, iIdx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={iIdx}
                    to={item.path}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all text-xs font-medium ${
                      isActive 
                        ? 'bg-blue-600/80 text-white shadow-sm border-r-4 border-white' 
                        : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="shrink-0">
                      <SidebarIcon name={item.iconName} className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{getMessage(item.name)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {!isAllowed && activeModule && (
          <div className="p-3 mx-2 bg-red-950/40 border border-red-900/60 rounded-lg text-red-200 text-xs">
            ⚠️ You do not have permissions to view this module.
          </div>
        )}
      </nav>

      {/* Bottom Actions Area */}
      <div className="border-t p-2 space-y-1 shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-xs font-semibold text-blue-300/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Icons.House className="w-3.5 h-3.5 shrink-0" />
          <span>Portal Switcher</span>
        </button>

        {user?.role === 'Super Admin' && activeModule !== 'admin' && (
          <button 
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-xs font-semibold text-blue-300/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Icons.Settings className="w-3.5 h-3.5 shrink-0" />
            <span>Admin Console</span>
          </button>
        )}
      </div>
    </aside>
  );
};
