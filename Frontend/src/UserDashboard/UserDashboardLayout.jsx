import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, BookOpen, FileText, Music } from 'lucide-react';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

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

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding:'1.5rem 1.25rem 1rem', borderBottom:`1px solid rgba(217,119,6,0.15)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>🎵</div>
          <div>
            <div style={{ fontFamily:SERIF, fontWeight:700, fontSize:'1.1rem', color:SLATE }}>Raadhyam</div>
            <div style={{ fontSize:'0.65rem', color:AMBER, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:SANS }}>Student Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'1rem 0.75rem', display:'flex', flexDirection:'column', gap:4 }}>
        {nav.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} style={{
              display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, border:'none',
              background: active ? `linear-gradient(135deg,${AMBER},#B45309)` : 'transparent',
              color: active ? '#fff' : '#64748B', fontWeight:600, fontSize:'0.88rem',
              cursor:'pointer', fontFamily:SANS, textAlign:'left', width:'100%',
              transition:'background 0.2s, color 0.2s',
              boxShadow: active ? '0 4px 14px rgba(217,119,6,0.3)' : 'none',
            }}
              onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background='rgba(217,119,6,0.08)'; e.currentTarget.style.color=SLATE; }}}
              onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748B'; }}}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Back to site */}
      <div style={{ padding:'0.75rem', borderTop:`1px solid #F1F5F9` }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderRadius:10, border:'none', background:'transparent', color:'#64748B', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', fontFamily:SANS, width:'100%' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.color=SLATE; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748B'; }}>
          <Home size={16} /> Back to Website
        </button>
      </div>

      {/* User footer */}
      <div style={{ padding:'1rem', borderTop:`1px solid #F1F5F9`, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1rem', fontFamily:SERIF, flexShrink:0 }}>
          {(userData.name || userData.email || 'U')[0].toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, color:SLATE, fontSize:'0.82rem', fontFamily:SANS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userData.name || 'Student'}</div>
          <div style={{ color:'#94A3B8', fontSize:'0.7rem', fontFamily:SANS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userData.email || ''}</div>
        </div>
        <button onClick={handleLogout} title="Logout" style={{ background:'none', border:'none', cursor:'pointer', color:'#94A3B8', padding:4, borderRadius:6, flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.color='#EF4444'}
          onMouseLeave={e=>e.currentTarget.style.color='#94A3B8'}>
          <LogOut size={16} />
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:SANS, display:'flex' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');`}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:40, display:'flex' }}>
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position:'relative', width:260, background:'#fff', display:'flex', flexDirection:'column', zIndex:50, boxShadow:'4px 0 24px rgba(0,0,0,0.12)' }}>
            <button onClick={() => setSidebarOpen(false)} style={{ position:'absolute', top:12, right:12, background:'none', border:'none', cursor:'pointer', color:'#94A3B8' }}><X size={20} /></button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div style={{ width:240, flexShrink:0, background:'#fff', borderRight:`1px solid #F1F5F9`, display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, boxShadow:'2px 0 12px rgba(30,41,59,0.04)' }} className="user-sidebar">
        <SidebarContent />
      </div>

      {/* Main */}
      <div style={{ flex:1, marginLeft:240, display:'flex', flexDirection:'column', minHeight:'100vh' }} className="user-main">
        {/* Mobile topbar */}
        <div style={{ display:'none', alignItems:'center', gap:12, padding:'0.75rem 1rem', background:'#fff', borderBottom:`2px solid ${AMBER}`, position:'sticky', top:0, zIndex:30 }} className="user-topbar">
          <button onClick={() => setSidebarOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:SLATE }}><Menu size={22} /></button>
          <span style={{ fontFamily:SERIF, fontWeight:700, fontSize:'1.1rem', color:SLATE }}>Raadhyam <span style={{color:AMBER}}>Portal</span></span>
        </div>

        <main style={{ flex:1, padding:'2rem' }}>
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
