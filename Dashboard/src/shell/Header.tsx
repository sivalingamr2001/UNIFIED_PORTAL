import React, { useState } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { LogOut, Bell, Search, ChevronDown, Factory } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  // Format today's date dynamically
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="flex items-center justify-between px-5 h-14 shrink-0 z-30 bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Brand & Left Navigation */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-sky-400">
            <Factory className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold tracking-tight text-blue-600">JANATICS</span>
            <span className="text-xs text-slate-400 ml-1 font-normal">Unified Suite</span>
            <span className="ml-3 text-xs text-slate-400 hidden md:inline">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search modules, documents, reports…" 
            className="w-full pl-8 pr-4 py-1.5 rounded-lg text-xs outline-none bg-slate-100 border border-slate-200 text-slate-800 transition-all focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center bg-red-600 text-white text-[9px] font-bold">
            4
          </span>
        </button>

        <div className="w-px h-6 mx-1 bg-slate-200"></div>

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br from-blue-600 to-sky-400 shadow">
                {getInitial(user.name)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-700 leading-tight">{user.name}</div>
                <div className="text-[10px] text-slate-400 leading-none">{user.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-xs font-semibold text-slate-700 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Portal Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
