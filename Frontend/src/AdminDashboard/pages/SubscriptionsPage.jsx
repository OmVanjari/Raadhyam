import { Card, PageHeader, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, StatCard, SectionTitle, SANS, TEXT, MUTED, BORDER, Y, YL, YD } from '../components/UI';

const HEADERS = ['User','Plan','Amount','Status','Start Date','Next Billing','Actions'];

const PLANS = [
  { name:'Free',            color:'#6B7280', features:['Ad-supported','Low quality','No offline'] },
  { name:'Monthly Premium', color:'#3B82F6', features:['No ads','High quality','Offline mode'] },
  { name:'Annual Premium',  color:YD,        features:['No ads','Lossless quality','Offline + Family'] },
];

const SubscriptionsPage = () => {
  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <div style={{ width:32, height:32, borderRadius:'50%', background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>👤</div>
      <div>
        <div style={{ width:90, height:11, background:'#F3F4F6', borderRadius:4, marginBottom:4 }} />
        <div style={{ width:120, height:10, background:'#F3F4F6', borderRadius:4 }} />
      </div>
    </div>,
    <div style={{ width:110, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:50, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%4===3?'Cancelled':i%4===2?'Pending':'Active'} />,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <RowActions active={i%4!==3} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      <PageHeader title="Subscriptions" subtitle="Manage user plans and billing"
        actions={[<OutlineBtn key="exp">⬇ Export</OutlineBtn>]} />

      {/* Plan cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }} className="plan-grid">
        {PLANS.map(p => (
          <Card key={p.name} style={{ borderTop:`3px solid ${p.color}` }}>
            <div style={{ fontSize:'0.78rem', fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{p.name}</div>
            <div style={{ width:60, height:22, background:'#F3F4F6', borderRadius:4, marginBottom:12 }} />
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize:'0.82rem', color:MUTED, marginBottom:5, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:p.color, fontWeight:700 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <div style={{ marginTop:'1rem', display:'flex', gap:6 }}>
              <button style={{ flex:1, padding:'6px', background:p.color, border:'none', borderRadius:6, fontSize:'0.75rem', fontWeight:600, color:'#fff', cursor:'pointer', fontFamily:SANS }}>Edit Plan</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }} className="sub-stats">
        <StatCard label="Monthly Revenue"    icon="💰" color={Y}       bg={YL}      />
        <StatCard label="Active Subs"        icon="✅" color="#10B981" bg="#ECFDF5" />
        <StatCard label="Cancelled This Mo." icon="❌" color="#EF4444" bg="#FEF2F2" />
        <StatCard label="Churn Rate"         icon="📉" color="#6B7280" bg="#F3F4F6" />
      </div>

      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by user, email, plan..."
          filters={['Active','Cancelled','Pending']}
          sortOptions={['Newest','Oldest','Amount High–Low','Amount Low–High']}
        />
        {/* Plan filter tabs */}
        <div className="filter-tabs" style={{ display:'flex', gap:6, padding:'0.75rem 1.25rem', borderBottom:`1px solid ${BORDER}`, flexWrap:'wrap' }}>
          {['All Plans','Free','Monthly Premium','Annual Premium'].map((f,i) => (
            <button key={f} style={{ padding:'5px 12px', borderRadius:8, border:`1.5px solid ${i===0?Y:BORDER}`, background:i===0?Y:'#fff', color:i===0?'#fff':MUTED, fontSize:'0.78rem', fontWeight:600, cursor:'pointer', fontFamily:SANS, whiteSpace:'nowrap' }}>{f}</button>
          ))}
        </div>
        <Table headers={HEADERS} rows={rows} checkable />
        <Pagination label="Showing 1–10 of 0 subscriptions" />
      </Card>
      <style>{`
        @media(max-width:768px){.plan-grid{grid-template-columns:1fr!important}.sub-stats{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.sub-stats{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
};

export default SubscriptionsPage;
