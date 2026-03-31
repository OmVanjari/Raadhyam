import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, User, Home,
  LayoutDashboard, Music, Users, Disc, Mic2,
  ListMusic, CreditCard, BarChart2, Settings, Bell, Search, Headphones
} from 'lucide-react';

const NAV = [
  { name:'Dashboard',     icon:LayoutDashboard, id:'dashboard' },
  { name:'Songs',         icon:Music,           id:'songs' },
  { name:'Albums',        icon:Disc,            id:'albums' },
  { name:'Artists',       icon:Mic2,            id:'artists' },
  { name:'Playlists',     icon:ListMusic,       id:'playlists' },
  { name:'Users',         icon:Users,           id:'students' },
  { name:'Subscriptions', icon:CreditCard,      id:'subscriptions' },
  { name:'Analytics',     icon:BarChart2,       id:'analytics' },
  { name:'Settings',      icon:Settings,        id:'settings' },
];

const Y  = '#FFC107';
const YL = '#FFF8E1';
const F  = "'Inter','Segoe UI',system-ui,sans-serif";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };
  const handleGoHome = () => navigate('/');
  const handleNav    = (id) => { setActiveTab(id); setSidebarOpen(false); };

  // Sync open state to CSS class for transition
  const sidebarRef = (el) => {
    if (!el) return;
    if (sidebarOpen) el.classList.add('sb-open');
    else el.classList.remove('sb-open');
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F9FAFB', fontFamily:F }}>

      {/* ── Backdrop (mobile/tablet) ── */}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:40 }} />
      )}

      {/* ══ SIDEBAR ══ */}
      <aside ref={sidebarRef} style={{
        position:'fixed', top:0, left:0, height:'100vh', width:220,
        background:'#fff', borderRight:'1px solid #E5E7EB',
        zIndex:50, display:'flex', flexDirection:'column',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
      }} className="adm-sb">

        {/* Logo row */}
        <div style={{ padding:'1rem 1rem 0.85rem', borderBottom:'1px solid #F3F4F6',
          display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:Y, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Headphones size={18} color="#fff" />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'0.95rem', color:'#111827' }}>Raadhyam</div>
            <div style={{ fontSize:'0.65rem', color:'#9CA3AF' }}>Admin Portal</div>
          </div>
          {/* Close — only visible on mobile/tablet */}
          <button onClick={()=>setSidebarOpen(false)} className="adm-sb-close"
            style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF',
              padding:4, display:'none' }}>
            <X size={18} />
          </button>
        </div>

        {/* Back to Home */}
        <div style={{ padding:'0.6rem 0.75rem' }}>
          <button onClick={handleGoHome}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:8,
              padding:'7px 10px', borderRadius:8, border:'none', background:'transparent',
              cursor:'pointer', fontSize:'0.82rem', fontWeight:500, color:'#6B7280', fontFamily:F }}
            onMouseEnter={e=>{ e.currentTarget.style.background=YL; e.currentTarget.style.color='#92400E'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6B7280'; }}>
            <Home size={15} /> Back to Home
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'0 0.75rem' }}>
          <p style={{ fontSize:'0.62rem', fontWeight:700, color:'#9CA3AF', letterSpacing:'0.1em',
            textTransform:'uppercase', padding:'0.5rem 0.5rem 0.25rem', margin:0 }}>Menu</p>
          {NAV.slice(0,6).map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={()=>handleNav(item.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10,
                  padding:'9px 12px', borderRadius:8, border:'none', cursor:'pointer',
                  fontFamily:F, fontSize:'0.875rem', fontWeight:active?600:500,
                  background:active?Y:'transparent', color:active?'#fff':'#6B7280',
                  marginBottom:2, textAlign:'left' }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=YL; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent'; }}>
                <Icon size={17} />{item.name}
              </button>
            );
          })}
          <p style={{ fontSize:'0.62rem', fontWeight:700, color:'#9CA3AF', letterSpacing:'0.1em',
            textTransform:'uppercase', padding:'0.9rem 0.5rem 0.25rem', margin:0 }}>System</p>
          {NAV.slice(6).map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={()=>handleNav(item.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10,
                  padding:'9px 12px', borderRadius:8, border:'none', cursor:'pointer',
                  fontFamily:F, fontSize:'0.875rem', fontWeight:active?600:500,
                  background:active?Y:'transparent', color:active?'#fff':'#6B7280',
                  marginBottom:2, textAlign:'left' }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=YL; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.background='transparent'; }}>
                <Icon size={17} />{item.name}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding:'0.9rem', borderTop:'1px solid #F3F4F6',
          display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:Y, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <User size={15} color="#fff" />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#111827',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Admin User</div>
            <div style={{ fontSize:'0.68rem', color:'#9CA3AF' }}>Super Admin</div>
          </div>
          <button onClick={handleLogout}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', padding:4, borderRadius:6 }}
            onMouseEnter={e=>e.currentTarget.style.color='#EF4444'}
            onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}>
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="adm-main" style={{ flex:1, marginLeft:220, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* ── Topbar ── */}
        <header style={{ height:56, background:'#fff', borderBottom:'1px solid #E5E7EB',
          display:'flex', alignItems:'center', padding:'0 1rem', gap:8,
          position:'sticky', top:0, zIndex:30 }}>

          {/* Hamburger */}
          <button onClick={()=>setSidebarOpen(true)} className="adm-hamburger"
            style={{ background:'none', border:'none', cursor:'pointer', color:'#6B7280',
              padding:6, borderRadius:8, display:'none', alignItems:'center',
              justifyContent:'center', flexShrink:0 }}>
            <Menu size={22} />
          </button>

          {/* Brand — mobile only */}
          <span className="adm-brand" style={{ fontWeight:800, fontSize:'0.95rem',
            color:'#111827', display:'none' }}>Raadhyam</span>

          {/* Search — desktop */}
          <div className="adm-search-desk" style={{ flex:1, maxWidth:380, position:'relative', marginLeft:'auto' }}>
            <Search size={14} style={{ position:'absolute', left:10, top:'50%',
              transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }} />
            <input placeholder="Search songs, artists, users..."
              style={{ width:'100%', padding:'7px 12px 7px 30px', border:'1.5px solid #E5E7EB',
                borderRadius:8, fontSize:'0.83rem', color:'#111827', background:'#F9FAFB',
                outline:'none', fontFamily:F, boxSizing:'border-box' }}
              onFocus={e=>{ e.target.style.borderColor=Y; e.target.style.background='#fff'; }}
              onBlur={e=>{ e.target.style.borderColor='#E5E7EB'; e.target.style.background='#F9FAFB'; }} />
          </div>

          {/* Search icon — mobile */}
          <button className="adm-search-icon" onClick={()=>setSearchOpen(v=>!v)}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#6B7280',
              padding:6, borderRadius:8, display:'none', alignItems:'center', flexShrink:0 }}>
            <Search size={20} />
          </button>

          {/* Notification */}
          <button style={{ position:'relative', background:'none', border:'none',
            cursor:'pointer', padding:7, borderRadius:8, color:'#6B7280', flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.background=YL}
            onMouseLeave={e=>e.currentTarget.style.background='none'}>
            <Bell size={19} />
            <span style={{ position:'absolute', top:5, right:5, width:7, height:7,
              borderRadius:'50%', background:'#EF4444', border:'2px solid #fff' }} />
          </button>

          {/* Avatar */}
          <div style={{ display:'flex', alignItems:'center', gap:7, padding:'4px 8px',
            borderRadius:8, cursor:'pointer', border:'1px solid #E5E7EB', flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.background=YL}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:Y, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <User size={13} color="#fff" />
            </div>
            <span className="adm-admin-lbl" style={{ fontSize:'0.8rem', fontWeight:600, color:'#111827' }}>Admin</span>
          </div>
        </header>

        {/* Mobile search bar */}
        {searchOpen && (
          <div style={{ background:'#fff', padding:'0.6rem 1rem', borderBottom:'1px solid #E5E7EB' }}>
            <div style={{ position:'relative' }}>
              <Search size={14} style={{ position:'absolute', left:10, top:'50%',
                transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }} />
              <input autoFocus placeholder="Search..."
                style={{ width:'100%', padding:'8px 12px 8px 30px', border:'1.5px solid #E5E7EB',
                  borderRadius:8, fontSize:'0.85rem', color:'#111827', background:'#F9FAFB',
                  outline:'none', fontFamily:F, boxSizing:'border-box' }}
                onFocus={e=>{ e.target.style.borderColor=Y; e.target.style.background='#fff'; }}
                onBlur={e=>{ e.target.style.borderColor='#E5E7EB'; e.target.style.background='#F9FAFB'; }} />
            </div>
          </div>
        )}

        {/* Page content */}
        <main style={{ flex:1, padding:'1.25rem', overflowY:'auto' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      {/* ══ GLOBAL RESPONSIVE CSS ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* Desktop: sidebar always visible */
        .adm-sb { transform: translateX(0) !important; }

        /* Tablet ≤1024px: sidebar hidden by default, slides in */
        @media (max-width: 1024px) {
          .adm-sb          { transform: translateX(-100%) !important; transition: transform .22s ease; }
          .adm-sb.sb-open  { transform: translateX(0) !important; }
          .adm-main        { margin-left: 0 !important; }
          .adm-hamburger   { display: flex !important; }
          .adm-sb-close    { display: flex !important; }
        }

        /* Mobile ≤640px */
        @media (max-width: 640px) {
          .adm-search-desk { display: none !important; }
          .adm-search-icon { display: flex !important; }
          .adm-admin-lbl   { display: none !important; }
          .adm-brand       { display: block !important; margin-right: auto; }
          main             { padding: 0.75rem !important; }
          header           { padding: 0 0.75rem !important; }
        }

        /* ── Responsive grid helpers (used by all pages) ── */
        .rg-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
        .rg-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .rg-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .rg-2-1 { display:grid; grid-template-columns:2fr 1fr; gap:1rem; }

        @media (max-width: 1024px) {
          .rg-4   { grid-template-columns: repeat(2,1fr); }
          .rg-3   { grid-template-columns: repeat(2,1fr); }
          .rg-2-1 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .rg-4   { grid-template-columns: 1fr; gap: 0.75rem; }
          .rg-3   { grid-template-columns: 1fr; gap: 0.75rem; }
          .rg-2   { grid-template-columns: 1fr; gap: 0.75rem; }
          .rg-2-1 { grid-template-columns: 1fr; gap: 0.75rem; }
        }

        /* Form 2-col */
        .form-2col { display:grid; grid-template-columns:1fr 1fr; gap:0 1rem; }
        @media (max-width: 640px) { .form-2col { grid-template-columns: 1fr !important; } }

        /* Settings grid */
        .settings-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; align-items:start; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr !important; } }

        /* Plan cards */
        .plan-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        @media (max-width: 768px) { .plan-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .plan-grid { grid-template-columns: 1fr; } }

        /* Album/artist card grid */
        .card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:1rem; }
        @media (max-width: 640px) { .card-grid { grid-template-columns: repeat(2,1fr); gap: 0.75rem; } }
        @media (max-width: 400px) { .card-grid { grid-template-columns: 1fr; } }

        /* Table horizontal scroll */
        .tbl-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
        .tbl-wrap table { min-width:700px; width:100%; }
        @media (max-width: 640px) {
          .tbl-wrap table { min-width: 600px; font-size: 0.8rem; }
          .tbl-wrap th, .tbl-wrap td { padding: 8px 10px !important; }
        }

        /* Toolbar wraps */
        .toolbar-row { display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:0.9rem 1.1rem; border-bottom:1px solid #E5E7EB; }
        .toolbar-row select, .toolbar-row input { min-width:0; }
        @media (max-width: 640px) {
          .toolbar-row { padding: 0.75rem; gap: 6px; }
          .toolbar-row > div:first-child { flex: 1 1 100%; }
          .toolbar-row select { flex: 1; min-width: 100px; font-size: 0.8rem; }
        }

        /* Filter tabs */
        .filter-tabs { display:flex; gap:6px; flex-wrap:wrap; }
        @media (max-width: 640px) {
          .filter-tabs { gap: 4px; }
          .filter-tabs button { padding: 4px 10px !important; font-size: 0.75rem !important; }
        }

        /* Page header actions */
        .ph-actions { display:flex; gap:8px; flex-wrap:wrap; }
        @media (max-width: 640px) {
          .ph-actions { width: 100%; }
          .ph-actions button { flex: 1; justify-content: center; }
        }

        /* Pagination */
        .pg-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; padding:10px 14px; border-top:1px solid #E5E7EB; }
        .pg-btns { display:flex; gap:4px; flex-wrap:wrap; }
        @media (max-width: 640px) {
          .pg-row { padding: 8px 10px; font-size: 0.75rem; }
          .pg-btns button { min-width: 24px; padding: 3px 7px !important; font-size: 0.75rem !important; }
        }

        /* Modal responsive */
        @media (max-width: 640px) {
          .adm-modal-wrap  { align-items:flex-end !important; padding:0 !important; }
          .adm-modal-inner { max-width:100% !important; border-radius:14px 14px 0 0 !important; max-height:92vh !important; }
          .adm-modal-inner > div:first-child { padding: 0.85rem 1rem !important; }
          .adm-modal-inner > div:last-child { padding: 1rem !important; }
        }

        /* View toggle */
        .view-toggle { display:flex; gap:6px; flex-wrap:wrap; }
        @media (max-width: 640px) {
          .view-toggle button { flex: 1; min-width: 80px; }
        }

        /* Stat cards */
        .stat-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.25rem; }
        @media (max-width:1024px) { .stat-row { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:640px)  { .stat-row { gap: 0.75rem; } }
        @media (max-width:480px)  { .stat-row { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
