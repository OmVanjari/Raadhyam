import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Avatar, Modal, FormGrid, Input, Select, Textarea, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Artist','Genre','Country','Followers','Songs','Albums','Status','Actions'];

const ArtistForm = ({ title, onClose }) => (
  <Modal title={title} onClose={onClose} wide>
    <FormGrid>
      <Input label="Artist Name"  placeholder="e.g. Luna Ray"       required />
      <Select label="Genre" options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave','J-Pop']} required />
      <Input label="Country"      placeholder="e.g. United States" />
      <Input label="Debut Year"   placeholder="e.g. 2018" />
      <Input label="Email"        placeholder="artist@email.com" type="email" />
      <Input label="Website"      placeholder="https://..." />
      <Select label="Status"      options={['Active','Inactive']} />
      <Input label="Monthly Listeners" placeholder="e.g. 2,100,000" />
    </FormGrid>
    <Textarea label="Bio" placeholder="Short artist biography..." rows={3} />
    <UploadBox label="Profile Photo" accept="JPG, PNG, WEBP — max 5MB" />
    <FormActions submitLabel="Save Artist" />
    <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
  </Modal>
);

const ArtistsPage = () => {
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('table');

  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <Avatar name="A" size={34} />
      <div style={{ width:90, height:11, background:'#F3F4F6', borderRadius:4 }} />
    </div>,
    <div style={{ width:70, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:50, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:30, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:30, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%4===3?'Inactive':'Active'} />,
    <RowActions active={i%4!==3} onEdit={()=>setModal('edit')} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <ArtistForm title="Add New Artist" onClose={()=>setModal(null)} />}
      {modal==='edit' && <ArtistForm title="Edit Artist"    onClose={()=>setModal(null)} />}

      <PageHeader title="Artists" subtitle="Manage all artists"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Add Artist</PrimaryBtn>,
        ]} />

      {/* View toggle */}
      <div style={{ display:'flex', gap:6, marginBottom:'1rem', flexWrap:'wrap' }} className="view-toggle">
        {['Table','Grid'].map((v,i) => (
          <button key={v} onClick={()=>setView(v.toLowerCase())}
            style={{ padding:'6px 14px', borderRadius:8, border:`1.5px solid ${view===v.toLowerCase()?Y:BORDER}`, background:view===v.toLowerCase()?Y:'#fff', color:view===v.toLowerCase()?'#fff':MUTED, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', fontFamily:SANS }}>{v}</button>
        ))}
      </div>

      {view === 'table' ? (
        <Card noPad>
          <Toolbar
            searchPlaceholder="Search by name, genre, country..."
            filters={['Active','Inactive']}
            sortOptions={['Name A–Z','Name Z–A','Most Followers','Most Songs']}
          />
          <Table headers={HEADERS} rows={rows} checkable />
          <Pagination label="Showing 1–10 of 0 artists" />
        </Card>
      ) : (
        <div>
          {/* Grid search bar */}
          <Card style={{ marginBottom:'1rem', padding:'0.75rem 1rem' }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:MUTED }}>🔍</span>
              <input placeholder="Search artists..." style={{ width:'100%', padding:'7px 10px 7px 30px', border:`1.5px solid ${BORDER}`, borderRadius:8, fontSize:'0.85rem', color:TEXT, background:'#F9FAFB', outline:'none', fontFamily:SANS, boxSizing:'border-box' }}
                onFocus={e=>{e.target.style.borderColor=Y;e.target.style.background='#fff';}}
                onBlur={e=>{e.target.style.borderColor=BORDER;e.target.style.background='#F9FAFB';}} />
            </div>
          </Card>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem' }} className="artist-grid">
            {Array.from({length:6}).map((_,i) => (
              <Card key={i} style={{ textAlign:'center', padding:'1.5rem 1rem' }}>
                <Avatar name="A" size={56} style={{ margin:'0 auto 0.75rem' }} />
                <div style={{ width:'70%', height:13, background:'#F3F4F6', borderRadius:4, margin:'0 auto 6px' }} />
                <div style={{ width:'50%', height:11, background:'#F3F4F6', borderRadius:4, margin:'0 auto 10px' }} />
                <Badge status={i%4===3?'Inactive':'Active'} />
                <div style={{ display:'flex', justifyContent:'center', gap:4, marginTop:10, flexWrap:'wrap' }}>
                  <RowActions active={i%4!==3} onEdit={()=>setModal('edit')} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      <style>{`
        .artist-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; }
        @media(max-width:640px) { .artist-grid { grid-template-columns:repeat(2,1fr); gap:0.75rem; } }
        @media(max-width:480px) { .artist-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default ArtistsPage;
