import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, BookOpen, FileText, Music } from 'lucide-react';

const UserDashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const userData = (() => {
    try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
  })();

  const nav = [
    { id: 'home',    name: 'Dashboard',    icon: Home },
    { id: 'courses', name: 'My Courses',   icon: BookOpen },
    { id: 'notes',   name: 'Music Notes',  icon: FileText },
    { id: 'profile', name: 'My Profile',   icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const SidebarContent = ({ mobile = false }) => (
    <>
      <div className="border-b border-amber-600/20 px-5 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-900 shadow-lg shadow-amber-500/30">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">Raadhyam</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">Student Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4 pt-4">
        <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">Navigation</p>
        <div className="space-y-1.5">
          {nav.map((item) => {
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

      <div className="px-3 pb-3">
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-xl border border-amber-500/25 bg-white/5 px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:border-amber-400/50 hover:bg-white/10"
        >
          <span className="flex items-center gap-2">
            <Home size={16} /> Back to Website
          </span>
        </button>
      </div>

      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-slate-900">
          {(userData.name || userData.email || 'U')[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-100">{userData.name || 'Student'}</div>
          <div className="truncate text-xs text-slate-400">{userData.email || ''}</div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut size={16} />
        </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100" style={{ display:'flex' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&display=swap');`}</style>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_24%,rgba(217,119,6,0.16),transparent_30%),radial-gradient(circle_at_86%_10%,rgba(15,23,42,0.12),transparent_28%)]" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-[1px]" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex h-full w-full max-w-[280px] flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
            <button className="absolute right-2 top-2 rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="user-sidebar fixed inset-y-0 left-0 hidden w-72 flex-col md:flex">
        <div className="m-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-slate-900/25">
        <SidebarContent />
        </div>
      </div>

      {/* Main */}
      <div className="user-main flex min-h-screen flex-1 flex-col md:ml-72">
        {/* Mobile topbar */}
        <div className="user-topbar sticky top-0 z-30 hidden items-center gap-3 border-b border-amber-200/60 bg-white/75 px-3 py-3 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-700 transition hover:bg-amber-50"><Menu size={22} /></button>
          <span className="text-base font-bold text-slate-900">Raadhyam <span className="text-amber-700">Portal</span></span>
        </div>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      <style>{`
        @media(max-width:768px){
          .user-sidebar{ display:none !important; }
          .user-main{ margin-left:0 !important; }
          .user-topbar{ display:flex !important; }
        }
      `}</style>
    </div>
  );
};

export default UserDashboardLayout;
