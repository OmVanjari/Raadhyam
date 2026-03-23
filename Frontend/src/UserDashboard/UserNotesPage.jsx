import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/music-notes')
      .then(r => setNotes(r.data.notes || r.data || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>Music Notes</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Download and study music notes shared by your instructors</p>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search notes..."
        style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:'0.9rem', fontFamily:SANS, color:SLATE, outline:'none', marginBottom:'1.5rem', background:'#fff' }}
        onFocus={e=>e.target.style.borderColor=AMBER} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>Loading notes...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎼</div>
          <p style={{ color:MUTED, fontFamily:SANS }}>No notes found.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
          {filtered.map((n,i) => (
            <div key={i} style={{ background:'#fff', borderRadius:16, padding:'1.5rem', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', transition:'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(217,119,6,0.12)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,41,59,0.05)'; }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:12, background:'rgba(217,119,6,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>🎼</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={{ fontFamily:SERIF, fontSize:'1.05rem', fontWeight:700, color:SLATE, marginBottom:4 }}>{n.title}</h3>
                  {n.category && <span style={{ fontSize:'0.7rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{n.category}</span>}
                </div>
              </div>
              {n.description && <p style={{ color:MUTED, fontSize:'0.82rem', lineHeight:1.6, fontFamily:SANS, margin:'1rem 0', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{n.description}</p>}
              <div style={{ display:'flex', gap:10, marginTop:'1rem' }}>
                {n.fileUrl && (
                  <a href={n.fileUrl} target="_blank" rel="noreferrer" style={{ flex:1, textAlign:'center', background:`linear-gradient(135deg,${AMBER},#B45309)`, color:'#fff', borderRadius:10, padding:'9px', fontSize:'0.82rem', fontWeight:700, textDecoration:'none', fontFamily:SANS }}>📥 Download</a>
                )}
                {n.previewUrl && (
                  <a href={n.previewUrl} target="_blank" rel="noreferrer" style={{ flex:1, textAlign:'center', background:'transparent', color:SLATE, border:'1.5px solid #E2E8F0', borderRadius:10, padding:'9px', fontSize:'0.82rem', fontWeight:700, textDecoration:'none', fontFamily:SANS }}>👁 Preview</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNotesPage;
