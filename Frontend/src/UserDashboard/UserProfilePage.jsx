import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const userData = (() => { try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; } })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>My Profile</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Your account information</p>
      </div>

      {/* Avatar card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'2rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'2rem', fontFamily:SERIF, flexShrink:0 }}>
          {(userData.name || userData.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontFamily:SERIF, fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:4 }}>{userData.name || 'Student'}</h2>
          <p style={{ color:MUTED, fontSize:'0.88rem', fontFamily:SANS }}>{userData.email || 'No email'}</p>
          <span style={{ display:'inline-block', marginTop:8, fontSize:'0.72rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'3px 12px', fontFamily:SANS, textTransform:'uppercase', letterSpacing:'0.08em' }}>
            {userData.role || 'Student'}
          </span>
        </div>
      </div>

      {/* Info card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'1.75rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', marginBottom:'1.25rem' }}>
        <h3 style={{ fontFamily:SERIF, fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:'1.25rem' }}>Account Details</h3>
        {[
          { label:'Full Name',  value: userData.name  || '—' },
          { label:'Email',      value: userData.email || '—' },
          { label:'Role',       value: userData.role  || 'Student' },
          { label:'Member Since', value: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long' }) : '—' },
        ].map((row,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem 0', borderBottom: i < 3 ? '1px solid #F8FAFC' : 'none' }}>
            <span style={{ fontSize:'0.82rem', fontWeight:700, color:MUTED, fontFamily:SANS, textTransform:'uppercase', letterSpacing:'0.06em' }}>{row.label}</span>
            <span style={{ fontSize:'0.9rem', fontWeight:600, color:SLATE, fontFamily:SANS }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ width:'100%', padding:'13px', borderRadius:12, border:'1.5px solid #FCA5A5', background:'rgba(239,68,68,0.05)', color:'#DC2626', fontSize:'0.9rem', fontWeight:700, cursor:'pointer', fontFamily:SANS, transition:'background 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.05)'}>
        🚪 Sign Out
      </button>
    </div>
  );
};

export default UserProfilePage;
