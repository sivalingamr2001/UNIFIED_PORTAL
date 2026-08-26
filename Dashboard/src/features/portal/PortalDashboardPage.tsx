import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { usePortalMessages } from '../../shared/hooks/usePortalMessages';
import { modulesApi } from '../../api/endpoints';
import type { ModuleModel } from '../../types/models';
import { Shield, Key, Landmark, ShoppingCart, Factory, Zap, FileText, BarChart3, Lock, ArrowRight, UserCheck } from 'lucide-react';

export const PortalDashboardPage: React.FC = () => {
  const { user, isPermittedModule } = useAuth();
  const { getMessage } = usePortalMessages();
  const [modules, setModules] = useState<ModuleModel[]>([]);
  const navigate = useNavigate();

  // Helper to map module name to graphic icon and routing path
  const getModuleMeta = (name: string) => {
    switch (name.toLowerCase()) {
      case 'admin':
        return {
          icon: Shield,
          path: '/admin',
          color: 'from-indigo-600 to-indigo-400',
          bg: 'bg-indigo-50',
          text: 'text-indigo-600',
          desc: 'System identity, role mapping & access overrides.'
        };
      case 'finance':
        return {
          icon: Landmark,
          path: '/finance',
          color: 'from-teal-600 to-teal-400',
          bg: 'bg-teal-50',
          text: 'text-teal-600',
          desc: 'Ledgers, contra vouchers, journal entries & aged trial balance.'
        };
      case 'scm':
        return {
          icon: ShoppingCart,
          path: '/scm',
          color: 'from-orange-600 to-orange-400',
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          desc: 'Purchase orders, supplier portal & stock levels.'
        };
      case 'mes':
        return {
          icon: Factory,
          path: '/mes',
          color: 'from-purple-600 to-purple-400',
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          desc: 'Shop floor control, machine monitoring & logging defects.'
        };
      case 'pms':
        return {
          icon: BarChart3,
          path: '/pms',
          color: 'from-pink-600 to-pink-400',
          bg: 'bg-pink-50',
          text: 'text-pink-600',
          desc: 'Department KPIs, individual goals & appraisal reviews.'
        };
      case 'dms':
        return {
          icon: FileText,
          path: '/dms',
          color: 'from-emerald-600 to-emerald-400',
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          desc: 'Document revisions, workflow approvals & drafts.'
        };
      case 'pes':
        return {
          icon: Key,
          path: '/pes',
          color: 'from-blue-600 to-blue-400',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          desc: 'Planning & execution control tower, ho planner & KPIs.'
        };
      case 'pes lite':
      case 'pes-lite':
        return {
          icon: Zap,
          path: '/pes-lite',
          color: 'from-cyan-600 to-cyan-400',
          bg: 'bg-cyan-50',
          text: 'text-cyan-600',
          desc: 'Quick planning overview, rates & execution control.'
        };
      default:
        return {
          icon: Factory,
          path: '/',
          color: 'from-slate-600 to-slate-400',
          bg: 'bg-slate-50',
          text: 'text-slate-600',
          desc: 'Standard enterprise system component.'
        };
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const list = await modulesApi.list();
        setModules(list);
      } catch (err) {
        console.error("Failed to load modules from API:", err);
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    if (!user || modules.length === 0) return;
    const permitted = modules.filter(mod => isPermittedModule(mod.name));
    if (permitted.length === 1) {
      const singleMod = permitted[0];
      const meta = getModuleMeta(singleMod.name);
      navigate(meta.path, { replace: true });
    }
  }, [user, modules, isPermittedModule, navigate]);

  const handleModuleClick = (moduleName: string, path: string) => {
    if (isPermittedModule(moduleName)) {
      navigate(path);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      {user && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-slate-800">Welcome back, {user.name}!</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              You are signed in to Janatics Unified Suite. Select any permitted module card below to begin your work.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-center">
              <div className="text-xs font-mono font-bold text-slate-700">{user.login}</div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">Username</div>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-center">
              <div className="text-xs font-mono font-bold text-blue-700">Sec-{user.sec}</div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Modules Switcher Grid Section */}
      <div>
        <h3 className="text-xs font-bold font-mono text-slate-600 uppercase tracking-widest mb-4">
          Your Modules
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map(mod => {
            const allowed = isPermittedModule(mod.name);
            const meta = getModuleMeta(mod.name);
            const Icon = meta.icon;
            
            return (
              <div
                key={mod.id}
                onClick={() => handleModuleClick(mod.name, meta.path)}
                className={`group border rounded-2xl p-5 flex flex-col justify-between h-48 transition-all duration-300 relative overflow-hidden ${
                  allowed
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                    : 'bg-slate-50/80 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Accent overlay gradient on hover */}
                {allowed && (
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${meta.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${allowed ? meta.bg : 'bg-slate-200'}`}>
                      <Icon className={`w-5 h-5 ${allowed ? meta.text : 'text-slate-500'}`} />
                    </div>
                    {!allowed && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-4 group-hover:text-blue-600 transition-colors">
                    {getMessage(mod.name)}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                {allowed && (
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 group-hover:text-blue-700 mt-3 pt-2">
                    Enter Module <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of details: Activity feed and updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold font-mono text-slate-600 uppercase tracking-widest mb-1">
            Recent System Activity Log
          </h4>
          <div className="divide-y divide-slate-100">
            <div className="flex items-start gap-3 py-3 first:pt-0">
              <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs text-slate-700 font-medium">System Role Assignment Modified</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Govindaraj changed TDS settings &bull; 10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs text-slate-700 font-medium">PES Planning Run Triggered</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Control Tower auto-optimized stock forecasts &bull; 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold font-mono text-slate-600 uppercase tracking-widest mb-1">
            Suite Release Notes
          </h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-xs font-bold text-slate-800">Version 2.4 Active</div>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
              Dynamic React Router 7 setup, code-split feature-based directory layouts, lazy routing, and interactive Org Charts have been successfully deployed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboardPage;
