import { Card, SectionTitle, Input, Select, Textarea, PrimaryBtn, OutlineBtn, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const Field = ({ label }) => (
  <div style={{ marginBottom:'1rem' }}>
    <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:TEXT, marginBottom:5, fontFamily:SANS }}>{label}</label>
    <div style={{ width:'100%', height:38, background:'#F9FAFB', border:`1.5px solid ${BORDER}`, borderRadius:8 }} />
  </div>
);

const SaveBtn = ({ label='Save Changes' }) => (
  <button style={{ padding:'8px 20px', background:Y, border:'none', borderRadius:8, fontSize:'0.85rem', fontWeight:600, color:'#fff', cursor:'pointer', fontFamily:SANS }}>{label}</button>
);

const SettingsPage = () => (
  <div style={{ fontFamily:SANS }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:8 }}>
      <div>
        <h1 style={{ fontSize:'1.2rem', fontWeight:700, color:TEXT, margin:0 }}>Settings</h1>
        <p style={{ fontSize:'0.82rem', color:MUTED, margin:'2px 0 0' }}>Platform configuration</p>
      </div>
      <OutlineBtn>↩ Reset to Defaults</OutlineBtn>
    </div>

    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', alignItems:'start' }} className="settings-grid">

      {/* General */}
      <Card>
        <SectionTitle>General</SectionTitle>
        <Field label="App Name" />
        <Field label="Support Email" />
        <Field label="Default Language" />
        <Field label="Currency" />
        <Field label="Timezone" />
        <SaveBtn />
      </Card>

      {/* Subscription Pricing */}
      <Card>
        <SectionTitle>Subscription Pricing</SectionTitle>
        <Field label="Monthly Plan Price ($)" />
        <Field label="Annual Plan Price ($)" />
        <Field label="Free Trial Days" />
        <Field label="Default Plan for New Users" />
        <Field label="Grace Period (days after expiry)" />
        <SaveBtn label="Update Pricing" />
      </Card>

      {/* Audio Quality */}
      <Card>
        <SectionTitle>Audio Quality</SectionTitle>
        <Field label="Free Tier Bitrate" />
        <Field label="Premium Bitrate" />
        <Field label="Offline Download Quality" />
        <Field label="Max Offline Downloads" />
        <SaveBtn label="Save Quality Settings" />
      </Card>

      {/* Upload Limits */}
      <Card>
        <SectionTitle>Upload Limits</SectionTitle>
        <Field label="Max Audio File Size (MB)" />
        <Field label="Max Image File Size (MB)" />
        <Field label="Allowed Audio Formats" />
        <Field label="Max Songs per Artist" />
        <Field label="Max Albums per Artist" />
        <SaveBtn label="Save Limits" />
      </Card>

      {/* Notifications */}
      <Card>
        <SectionTitle>Email Notifications</SectionTitle>
        {[
          'New user registration',
          'New subscription',
          'Subscription cancellation',
          'New song upload',
          'New artist registration',
          'Weekly analytics report',
          'Failed payment alert',
        ].map(item => (
          <div key={item} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${BORDER}` }}>
            <span style={{ fontSize:'0.85rem', color:TEXT }}>{item}</span>
            <div style={{ width:36, height:20, borderRadius:10, background:Y, position:'relative', cursor:'pointer', flexShrink:0 }}>
              <div style={{ position:'absolute', right:2, top:2, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop:'1rem' }}><SaveBtn label="Save Preferences" /></div>
      </Card>

      {/* Admin Profile */}
      <Card>
        <SectionTitle>Admin Profile</SectionTitle>
        <Field label="Full Name" />
        <Field label="Email Address" />
        <Field label="Phone Number" />
        <Field label="New Password" />
        <Field label="Confirm New Password" />
        <div style={{ display:'flex', gap:8, marginTop:'0.25rem' }}>
          <SaveBtn label="Update Profile" />
          <OutlineBtn>Change Avatar</OutlineBtn>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <SectionTitle>Security</SectionTitle>
        {[
          { label:'Two-Factor Authentication', on:true },
          { label:'Login Alerts via Email',    on:true },
          { label:'Session Timeout (30 min)',  on:false },
          { label:'IP Whitelist',              on:false },
        ].map(s => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${BORDER}` }}>
            <span style={{ fontSize:'0.85rem', color:TEXT }}>{s.label}</span>
            <div style={{ width:36, height:20, borderRadius:10, background:s.on?Y:'#E5E7EB', position:'relative', cursor:'pointer', flexShrink:0 }}>
              <div style={{ position:'absolute', top:2, left:s.on?18:2, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop:'1rem' }}><SaveBtn label="Save Security Settings" /></div>
      </Card>

      {/* Danger Zone */}
      <Card style={{ borderColor:'#FCA5A5' }}>
        <SectionTitle>Danger Zone</SectionTitle>
        <p style={{ fontSize:'0.82rem', color:MUTED, marginBottom:'1rem' }}>These actions are irreversible. Proceed with caution.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { label:'Clear All Cache',         color:'#F59E0B' },
            { label:'Delete All Inactive Users',color:'#EF4444' },
            { label:'Reset Platform Data',      color:'#EF4444' },
          ].map(a => (
            <button key={a.label} style={{ padding:'8px 16px', background:'#fff', border:`1.5px solid ${a.color}`, borderRadius:8, fontSize:'0.85rem', fontWeight:600, color:a.color, cursor:'pointer', fontFamily:SANS, textAlign:'left' }}>
              {a.label}
            </button>
          ))}
        </div>
      </Card>
    </div>

    <style>{`@media(max-width:768px){.settings-grid{grid-template-columns:1fr!important}}`}</style>
  </div>
);

export default SettingsPage;
