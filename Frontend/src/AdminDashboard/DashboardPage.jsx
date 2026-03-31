import { Card, SectionTitle, StatCard, ChartBox, Cover, Avatar, Badge, RowActions, SANS, TEXT, MUTED, BORDER, Y, YL } from './components/UI';

const DashboardPage = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', fontFamily:SANS }}>

    {/* Header */}
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:'1rem' }}>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <h1 style={{ fontSize:'1.2rem', fontWeight:700, color:TEXT, margin:0 }}>Dashboard</h1>
        <p style={{ fontSize:'0.82rem', color:MUTED, margin:'2px 0 0' }}>Welcome back, Admin</p>
      </div>
      <div style={{ fontSize:'0.82rem', color:MUTED, background:'#fff', border:`1px solid ${BORDER}`, borderRadius:8, padding:'6px 12px', whiteSpace:'nowrap' }}>
        📅 Today's Date
      </div>
    </div>

    {/* Stat cards */}
    <div className="stat-row">
      <StatCard label="Total Users"   icon="👥" color="#3B82F6" bg="#EFF6FF" />
      <StatCard label="Total Songs"   icon="🎵" color="#8B5CF6" bg="#F5F3FF" />
      <StatCard label="Total Artists" icon="🎤" color="#10B981" bg="#ECFDF5" />
      <StatCard label="Revenue"       icon="💰" color={Y}       bg={YL}      />
    </div>

    {/* Charts */}
    <div className="rg-3">
      <Card><SectionTitle>User Growth</SectionTitle><ChartBox label="Line chart — user growth" /></Card>
      <Card><SectionTitle>Streams / Plays</SectionTitle><ChartBox label="Bar chart — streams" /></Card>
      <Card><SectionTitle>Revenue</SectionTitle><ChartBox label="Bar chart — revenue" /></Card>
    </div>

    {/* Recent Songs + Recent Activity */}
    <div className="rg-2">

      {/* Recent Songs */}
      <Card noPad>
        <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <h3 style={{ fontSize:'0.92rem', fontWeight:700, color:TEXT, margin:0 }}>Recent Songs</h3>
          <button style={{ fontSize:'0.78rem', color:Y, background:'none', border:'none', cursor:'pointer', fontWeight:600, fontFamily:SANS, whiteSpace:'nowrap' }}>View all →</button>
        </div>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 1.25rem', borderBottom:`1px solid ${BORDER}`, flexWrap:'wrap' }}>
            <Cover size={34} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ width:'70%', height:11, background:'#F3F4F6', borderRadius:4, marginBottom:5 }} />
              <div style={{ width:'50%', height:10, background:'#F3F4F6', borderRadius:4 }} />
            </div>
            <Badge status="Active" />
            <RowActions active={true} />
          </div>
        ))}
      </Card>

      {/* Recent Activity */}
      <Card noPad>
        <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${BORDER}` }}>
          <h3 style={{ fontSize:'0.92rem', fontWeight:700, color:TEXT, margin:0 }}>Recent Activity</h3>
        </div>
        {[
          { icon:'👤', text:'New user registered', time:'2 min ago' },
          { icon:'🎵', text:'New song uploaded',   time:'15 min ago' },
          { icon:'💳', text:'New subscription',    time:'1 hr ago' },
          { icon:'🎤', text:'Artist profile updated', time:'3 hr ago' },
          { icon:'🗑️', text:'Album deleted',       time:'5 hr ago' },
        ].map((a,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 1.25rem', borderBottom:`1px solid ${BORDER}` }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.82rem', color:TEXT, fontWeight:500 }}>{a.text}</div>
              <div style={{ fontSize:'0.72rem', color:MUTED, marginTop:2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>

    {/* Top Artists */}
    <Card noPad>
      <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <h3 style={{ fontSize:'0.92rem', fontWeight:700, color:TEXT, margin:0 }}>Top Artists</h3>
        <button style={{ fontSize:'0.78rem', color:Y, background:'none', border:'none', cursor:'pointer', fontWeight:600, fontFamily:SANS, whiteSpace:'nowrap' }}>View all →</button>
      </div>
      <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:SANS, fontSize:'0.85rem', minWidth:700 }}>
          <thead>
            <tr style={{ background:'#F9FAFB' }}>
              {['#','Artist','Genre','Followers','Songs','Status','Actions'].map(h => (
                <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:'0.72rem', fontWeight:600, color:MUTED, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1,2,3].map(i => (
              <tr key={i} style={{ borderTop:`1px solid ${BORDER}` }}
                onMouseEnter={e=>e.currentTarget.style.background='#FAFAFA'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'10px 14px', color:MUTED, fontSize:'0.8rem' }}>#{i}</td>
                <td style={{ padding:'10px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <Avatar name="A" size={32} />
                    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />
                  </div>
                </td>
                <td style={{ padding:'10px 14px' }}><div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} /></td>
                <td style={{ padding:'10px 14px' }}><div style={{ width:50, height:11, background:'#F3F4F6', borderRadius:4 }} /></td>
                <td style={{ padding:'10px 14px' }}><div style={{ width:30, height:11, background:'#F3F4F6', borderRadius:4 }} /></td>
                <td style={{ padding:'10px 14px' }}><Badge status="Active" /></td>
                <td style={{ padding:'10px 14px' }}><RowActions active={true} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

      <style>{`
        @media(max-width:640px){
          .dash-charts{grid-template-columns:1fr !important;}
          .dash-two{grid-template-columns:1fr !important;}
        }
      `}</style>
  </div>
);

export default DashboardPage;
