import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Home,
  BookOpen,
  LayoutDashboard,
  FileText,
  Users
} from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Courses', icon: BookOpen, id: 'courses' },
    { name: 'Music Notes', icon: FileText, id: 'notes' },
    { name: 'Students', icon: Users, id: 'students' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const adminData = (() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  })();

  const SidebarContent = ({ mobile = false }) => (
    <>
      <div className="px-5 pt-6 pb-4 border-b border-amber-600/20">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-900 shadow-lg shadow-amber-500/30">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Raadhyam</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handleGoHome}
          className="w-full rounded-xl border border-amber-500/25 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:border-amber-400/50 hover:bg-white/10"
        >
          <span className="flex items-center gap-2">
            <Home size={16} /> Back to Website
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 pb-4">
        <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">Navigation</p>
        <div className="space-y-1.5">
          {navigation.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (mobile) setSidebarOpen(false);
                }}
                className={`group w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-md shadow-amber-500/35'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className={`h-4.5 w-4.5 ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-amber-300'}`} />
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-slate-900">
            {(adminData.name || adminData.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-100">{adminData.name || 'Admin User'}</p>
            <p className="truncate text-xs text-slate-400">{adminData.email || 'admin@raadhyam.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/15 hover:text-red-300"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(217,119,6,0.16),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(15,23,42,0.12),transparent_28%)]" />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-[1px]" onClick={() => setSidebarOpen(false)}></div>
          
          <div className="relative flex h-full w-full max-w-[280px] flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
            <div className="absolute right-2 top-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 hidden w-72 md:flex md:flex-col">
        <div className="m-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-slate-900/25">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-72">
        <div className="sticky top-0 z-30 border-b border-amber-200/60 bg-white/75 px-2 py-2 backdrop-blur md:hidden">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-amber-50 hover:text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-6 md:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;