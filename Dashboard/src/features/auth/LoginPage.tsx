import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { Factory, LayoutDashboard, CircleAlert, ChartColumn, Users, Lock, Eye, EyeOff, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden max-lg:h-auto max-lg:min-h-screen max-lg:overflow-y-auto">
      {/* Left panel: Info & brand */}
      <div 
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-10"
        style={{
          background: 'linear-gradient(145deg, rgb(10, 31, 68) 0%, rgb(15, 42, 82) 40%, rgb(26, 58, 107) 70%, rgb(26, 95, 214) 100%)'
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgb(14, 165, 233) 0%, transparent 70%)' }}
          />
          <div 
            className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgb(26, 95, 214) 0%, transparent 70%)' }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 border border-white/20">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-4xl tracking-tight text-blue-400" style={{ letterSpacing: '-0.02em' }}>
              JANATICS
            </div>
            <div className="text-blue-200 text-xs tracking-widest uppercase mt-1">Unified Suite</div>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 px-12 py-8 flex-1 flex flex-col justify-center">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-blue-200 bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Unified Control<br />
            <span className="text-blue-400">for Every Process.</span>
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            One platform connecting production, supply chain, documentation, and people — in real time.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-100 bg-white/5 border border-white/10">
              <LayoutDashboard className="w-3.5 h-3.5 opacity-80" /> Dashboards
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-100 bg-white/5 border border-white/10">
              <CircleAlert className="w-3.5 h-3.5 opacity-80" /> Alerts
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-100 bg-white/5 border border-white/10">
              <ChartColumn className="w-3.5 h-3.5 opacity-80" /> KPIs
            </span>
          </div>
        </div>

        {/* Bottom Footer Statistics */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-xs text-blue-300 mt-0.5">Modules</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">10+</div>
            <div className="text-xs text-blue-300 mt-0.5">Dashboards</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-blue-300 mt-0.5">Real-time Sync</div>
          </div>
        </div>
      </div>

      {/* Right panel: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
        {/* Mobile Header (Brand block) */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-3xl text-blue-600" style={{ letterSpacing: '-0.02em' }}>
              JANATICS
            </div>
            <div className="text-xs text-slate-400 tracking-widest uppercase mt-0.5">Unified Suite</div>
          </div>
        </div>

        {/* Card Frame */}
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1" style={{ letterSpacing: '-0.01em' }}>
              Janatics Unified Login
            </h2>
            <p className="text-slate-500 text-sm">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-lg text-xs font-semibold text-red-800 bg-red-50 border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Enter username (e.g. admin)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-800 outline-none transition-all bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500"
                  autoComplete="username" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-slate-800 outline-none transition-all bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500"
                  autoComplete="current-password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 select-none">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <button type="button" className="text-blue-600 hover:underline font-semibold transition-colors">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:shadow-[0_4px_14px_rgba(26,95,214,0.4)] disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo details alert box */}
          <div className="mt-6 p-3 rounded-lg text-xs text-slate-500 flex flex-col gap-1.5 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-semibold text-slate-600">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Demo credentials
            </div>
            <div className="flex items-center justify-between pl-1">
              <span className="font-mono font-bold text-slate-700">admin / admin</span>
              <span className="text-slate-400">All modules</span>
            </div>
            <div className="flex items-center justify-between pl-1">
              <span className="font-mono font-bold text-slate-700">skyfast / skyfast</span>
              <span className="text-slate-400">Finance · SCM</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-slate-400">
          &copy; 2026 EnterpriseOS &middot; v4.2.1 &middot; <span className="hover:text-slate-600 cursor-pointer">Privacy</span> &middot; <span className="hover:text-slate-600 cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
