import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar/Sidebar';

export const AppShell: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading Janatics Unified Suite...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user session is not found
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Dynamic Header */}
      <Header />
      
      {/* Inner Viewport Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dynamic Sidebar */}
        <Sidebar />
        
        {/* Dynamic Page Content Outlet */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f0f4f8]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AppShell;
