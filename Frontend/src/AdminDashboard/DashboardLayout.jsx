import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, BookOpen, LayoutDashboard, FileText, Users } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard',   icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Courses',     icon: BookOpen,         id: 'courses' },
    { name: 'Music Notes', icon: FileText,          id: 'notes' },
    { name: 'Students',    icon: Users,             id: 'students' },
  ];

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };
  const handleGoHome  = () => navigate('/');

  const NavItem = ({ item, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
        activeTab === item.id
          ? 'bg-amber-50 text-amber-700 border border-amber-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <item.icon size={17} className={`mr-3 flex-shrink-0 ${activeTab === item.id ? 'text-amber-600' : 'text-gray-400'}`} />
      {item.name}
    </button>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">Raadhyam</div>
          <div className="text-xs text-gray-400">Admin Panel</div>
        </div>
      </div>

      {/* Back to site */}
      <div className="px-3 pt-4 pb-2">
        <button onClick={handleGoHome}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <Home size={16} className="mr-2.5" /> Back to Website
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navigation.map(item => (
          <NavItem key={item.id} item={item} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} />
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <User size={15} className="text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">Admin</div>
            <div className="text-xs text-gray-400 truncate">admin@raadhyam.com</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50">
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-56 md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Main */}
      <div className="flex-1 md:ml-56 flex flex-col">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-800">
            <Menu size={22} />
          </button>
          <span className="font-semibold text-gray-800 text-sm">Raadhyam Admin</span>
        </div>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
