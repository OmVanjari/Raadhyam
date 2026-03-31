import { Card, PageHeader, OutlineBtn, SectionTitle, StatCard, ChartBox, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const AnalyticsPage = () => (
  <div style={{ fontFamily:SANS }}>
    <PageHeader title="Analytics" subtitle="Platform performance overview"
      actions={[
        <select key="range" style={{ padding:'7px 12px', border:`1.5px solid ${BORDER}`, borderRadius:8, fontSize:'0.85rem', color:TEXT, background:'#fff', outline:'none', fontFamily:SANS, cursor:'pointer' }}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 12 months</option>
          <option>Custom range</option>
        </select>,
        <OutlineBtn key="exp">⬇ Export Report</OutlineBtn>,
      ]} />

    <div className="stat-row">
      <StatCard label="Total Streams"    icon="▶️" color="#3B82F6" bg="#EFF6FF" />
      <StatCard label="Avg. Session"     icon="⏱️" color="#8B5CF6" bg="#F5F3FF" />
      <StatCard label="Monthly Revenue"  icon="💰" color={Y}       bg={YL}      />
      <StatCard label="New Users"        icon="👤" color="#10B981" bg="#ECFDF5" />
    </div>

    <div className="rg-2-1" style={{ marginBottom:'1.25rem' }}>
      <Card><SectionTitle>User Growth (Monthly)</SectionTitle><ChartBox height={140} label="Line chart — monthly user growth" /></Card>
      <Card><SectionTitle>Plan Distribution</SectionTitle><ChartBox height={140} label="Pie chart — Free vs Premium" /></Card>
    </div>

    <div className="rg-3" style={{ marginBottom:'1.25rem' }}>
      <Card><SectionTitle>Total Streams</SectionTitle><ChartBox label="Bar chart — streams" /></Card>
      <Card><SectionTitle>Revenue ($)</SectionTitle><ChartBox label="Bar chart — revenue" /></Card>
      <Card><SectionTitle>New Subscriptions</SectionTitle><ChartBox label="Line chart — new subs" /></Card>
    </div>

    <div className="rg-2" style={{ marginBottom:'1.25rem' }}>
      {/* Top Songs */}
      <Card>
        <SectionTitle>Top Songs This Month</SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[100,82,65,50,38].map((pct,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:MUTED, width:18, textAlign:'center' }}>#{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ width:110, height:11, background:'#F3F4F6', borderRadius:4 }} />
                  <div style={{ width:40,  height:11, background:'#F3F4F6', borderRadius:4 }} />
                </div>
                <div style={{ height:6, background:'#F3F4F6', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:Y, borderRadius:3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Artists */}
      <Card>
        <SectionTitle>Top Artists This Month</SectionTitle>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[100,78,60,45,30].map((pct,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:MUTED, width:18, textAlign:'center' }}>#{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ width:100, height:11, background:'#F3F4F6', borderRadius:4 }} />
                  <div style={{ width:50,  height:11, background:'#F3F4F6', borderRadius:4 }} />
                </div>
                <div style={{ height:6, background:'#F3F4F6', borderRadius:3 }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:'#8B5CF6', borderRadius:3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Churn + Retention */}
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }} className="chart-2">
      <Card><SectionTitle>Churn Rate</SectionTitle><ChartBox label="Line chart — churn rate" /></Card>
      <Card><SectionTitle>Retention Rate</SectionTitle><ChartBox label="Bar chart — retention" /></Card>
    </div>

    <style>{`
      @media(max-width:1024px){ .chart-3{grid-template-columns:1fr 1fr!important} }
      @media(max-width:768px){
        .kpi-grid{grid-template-columns:1fr 1fr!important}
        .chart-main{grid-template-columns:1fr!important}
        .chart-3{grid-template-columns:1fr!important}
        .chart-2{grid-template-columns:1fr!important}
      }
      @media(max-width:480px){ .kpi-grid{grid-template-columns:1fr!important} }
    `}</style>
  </div>
);

export default AnalyticsPage;
