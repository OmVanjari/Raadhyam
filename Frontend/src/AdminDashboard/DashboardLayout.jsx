import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Home,
  LayoutDashboard,
  Music,
  Users,
  Disc,
  Mic2,
  ListMusic,
  CreditCard,
  BarChart2,
  Settings,
  Bell,
  Search,
  BookOpen,
} from 'lucide-react';

const NAV = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Songs', icon: Music, id: 'songs' },
  { name: 'Albums', icon: Disc, id: 'albums' },
  { name: 'Artists', icon: Mic2, id: 'artists' },
  { name: 'Playlists', icon: ListMusic, id: 'playlists' },
  { name: 'Users', icon: Users, id: 'students' },
  { name: 'Subscriptions', icon: CreditCard, id: 'subscriptions' },
  { name: 'Analytics', icon: BarChart2, id: 'analytics' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoHome = () => navigate('/');

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
          {NAV.map((item) => {
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
                  <item.icon
                    className={`h-4.5 w-4.5 ${
                      active ? 'text-slate-900' : 'text-slate-400 group-hover:text-amber-300'
                    }`}
                  />
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

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-[1px]" onClick={() => setSidebarOpen(false)} />
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

      <div className="fixed inset-y-0 left-0 hidden w-72 md:flex md:flex-col">
        <div className="m-3 flex h-[calc(100vh-1.5rem)] flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-slate-900/25">
          <SidebarContent />
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-72">
        <header className="sticky top-0 z-30 border-b border-amber-200/60 bg-white/80 px-3 py-2 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-2 sm:px-2">
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-amber-50 hover:text-slate-900 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="relative hidden w-full max-w-lg md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search songs, artists, users..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 outline-none transition focus:border-amber-400"
              />
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-amber-50 hover:text-slate-900 md:hidden"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-amber-50 hover:text-slate-900">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 sm:block">
                Admin
              </div>
            </div>
          </div>

          {searchOpen && (
            <div className="mt-2 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 outline-none transition focus:border-amber-400"
                />
              </div>
            </div>
          )}
        </header>

        <main className="flex-1">
          <div className="py-6 md:py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>

      <style>{`
        .rg-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .rg-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .rg-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .rg-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }

        @media (max-width: 1024px) {
          .rg-4 { grid-template-columns: repeat(2, 1fr); }
          .rg-3 { grid-template-columns: repeat(2, 1fr); }
          .rg-2-1 { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .rg-4, .rg-3, .rg-2, .rg-2-1 { grid-template-columns: 1fr; gap: 0.75rem; }
        }

        .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
        @media (max-width: 640px) { .form-2col { grid-template-columns: 1fr !important; } }

        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; align-items: start; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr !important; } }

        .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        @media (max-width: 768px) { .plan-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .plan-grid { grid-template-columns: 1fr; } }

        .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 1rem; }
        @media (max-width: 640px) { .card-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } }
        @media (max-width: 400px) { .card-grid { grid-template-columns: 1fr; } }

        .tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tbl-wrap table { min-width: 700px; width: 100%; }
        @media (max-width: 640px) {
          .tbl-wrap table { min-width: 600px; font-size: 0.8rem; }
          .tbl-wrap th, .tbl-wrap td { padding: 8px 10px !important; }
        }

        .toolbar-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          padding: 0.9rem 1.1rem;
          border-bottom: 1px solid #E5E7EB;
        }
        .toolbar-row select, .toolbar-row input { min-width: 0; }

        @media (max-width: 640px) {
          .toolbar-row { padding: 0.75rem; gap: 6px; }
          .toolbar-row > div:first-child { flex: 1 1 100%; }
          .toolbar-row select { flex: 1; min-width: 100px; font-size: 0.8rem; }
        }

        .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .filter-tabs { gap: 4px; }
          .filter-tabs button { padding: 4px 10px !important; font-size: 0.75rem !important; }
        }

        .ph-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .ph-actions { width: 100%; }
          .ph-actions button { flex: 1; justify-content: center; }
        }

        .pg-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 14px;
          border-top: 1px solid #E5E7EB;
        }
        .pg-btns { display: flex; gap: 4px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .pg-row { padding: 8px 10px; font-size: 0.75rem; }
          .pg-btns button { min-width: 24px; padding: 3px 7px !important; font-size: 0.75rem !important; }
        }

        @media (max-width: 640px) {
          .adm-modal-wrap { align-items: flex-end !important; padding: 0 !important; }
          .adm-modal-inner { max-width: 100% !important; border-radius: 14px 14px 0 0 !important; max-height: 92vh !important; }
          .adm-modal-inner > div:first-child { padding: 0.85rem 1rem !important; }
          .adm-modal-inner > div:last-child { padding: 1rem !important; }
        }

        .view-toggle { display: flex; gap: 6px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .view-toggle button { flex: 1; min-width: 80px; }
        }

        .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
        @media (max-width: 1024px) { .stat-row { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .stat-row { gap: 0.75rem; } }
        @media (max-width: 480px) { .stat-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
