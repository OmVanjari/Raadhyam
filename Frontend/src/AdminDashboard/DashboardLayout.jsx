import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, Home, BookOpen,
  LayoutDashboard, FileText, Users, Music
} from 'lucide-react';

const STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-fadeIn      { animation: fadeIn      0.25s ease both; }
  .anim-slideInLeft { animation: slideInLeft 0.28s ease both; }
  .anim-fadeInUp    { animation: fadeInUp    0.3s  ease both; }
`;

const navigation = [
  { name: 'Dashboard',   icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Courses',     icon: BookOpen,         id: 'courses'   },
  { name: 'Music Notes', icon: FileText,          id: 'notes'     },
  { name: 'Students',    icon: Users,             id: 'students'  },
];

const NavItem = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
      active ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {active && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-amber-500 rounded-full" />}
    <item.icon size={17} className={`mr-3 flex-shrink-0 transition-colors ${active ? 'text-amber-600' : 'text-gray-400'}`} />
    {item.name}
  </button>
);

const SidebarContent = ({ activeTab, setActiveTab, setSidebarOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };
  const handleGoHome = () => navigate('/');

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <Music size={15} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-sm leading-tight">Raadhyam</div>
          <span className="inline-block text-[10px] font-semibold tracking-wide text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 leading-4 mt-0.5">
            Admin
          </span>
        </div>
      </div>

      {/* Back to site */}
      <div className="px-3 pt-4 pb-2">
        <button onClick={handleGoHome}
          className="w-full flex items-center px-3 py-2 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150">
          <Home size={14} className="mr-2 flex-shrink-0" /> Back to Website
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navigation.map(item => (
          <NavItem key={item.id} item={item} active={activeTab === item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} />
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">Admin</div>
            <div className="text-xs text-gray-400 truncate">admin@raadhyam.com</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => {
    if (!document.getElementById('dash-anim-styles')) {
      const tag = document.createElement('style');
      tag.id = 'dash-anim-styles';
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8FAFC' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/40 anim-fadeIn" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-60 bg-white shadow-2xl z-50 anim-slideInLeft">
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16} />
            </button>
            <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex md:flex-col md:w-56 md:fixed md:inset-y-0 bg-white border-r border-gray-200 ${mounted ? 'anim-slideInLeft' : 'opacity-0'}`}>
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
          <button onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
              <Music size={12} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Raadhyam Admin</span>
          </div>
        </header>

        <main className={`flex-1 p-4 md:p-6 ${mounted ? 'anim-fadeIn' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
