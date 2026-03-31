import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Modal, FormGrid, Input, Select, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Album','Artist','Genre','Year','Tracks','Status','Actions'];

const AlbumForm = ({ title, onClose }) => (
  <Modal title={title} onClose={onClose} wide>
    <FormGrid>
      <Input label="Album Title"  placeholder="e.g. Neon Dreams"  required />
      <Input label="Artist"       placeholder="e.g. Luna Ray"     required />
      <Select label="Genre" options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave','J-Pop']} required />
      <Input label="Release Year" placeholder="e.g. 2025" />
      <Input label="Total Tracks" placeholder="e.g. 12" type="number" />
      <Select label="Status"      options={['Active','Inactive','Draft']} />
      <Input label="Label"        placeholder="Record label name" />
      <Input label="UPC Code"     placeholder="Universal Product Code" />
    </FormGrid>
    <UploadBox label="Album Cover *" accept="JPG, PNG, WEBP — max 5MB" required />
    <FormActions submitLabel="Save Album" />
    <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
  </Modal>
);

const AlbumsPage = () => {
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('grid');

  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <div style={{ width:34, height:34, borderRadius:6, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>💿</div>
      <div style={{ width:100, height:11, background:'#F3F4F6', borderRadius:4 }} />
    </div>,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:40, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:30, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%4===3?'Inactive':i%4===2?'Draft':'Active'} />,
    <RowActions active={i%4!==3} onEdit={()=>setModal('edit')} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <AlbumForm title="Add New Album" onClose={()=>setModal(null)} />}
      {modal==='edit' && <AlbumForm title="Edit Album"    onClose={()=>setModal(null)} />}

      <PageHeader title="Albums" subtitle="Manage all albums"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Add Album</PrimaryBtn>,
        ]} />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
        <div className="view-toggle" style={{ display:'flex', gap:6 }}>
          {['Grid','Table'].map((v,i) => (
            <button key={v} onClick={()=>setView(v.toLowerCase())}
              style={{ padding:'6px 14px', borderRadius:8, border:`1.5px solid ${view===v.toLowerCase()?Y:BORDER}`, background:view===v.toLowerCase()?Y:'#fff', color:view===v.toLowerCase()?'#fff':MUTED, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', fontFamily:SANS }}>{v}</button>
          ))}
        </div>
        {/* Inline search for grid */}
        {view==='grid' && (
          <div style={{ position:'relative', flex:'1 1 240px', minWidth: 200, maxWidth: '100%' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:MUTED }}>🔍</span>
            <input placeholder="Search albums..." style={{ width:'100%', padding:'7px 10px 7px 30px', border:`1.5px solid ${BORDER}`, borderRadius:8, fontSize:'0.85rem', color:TEXT, background:'#F9FAFB', outline:'none', fontFamily:SANS, boxSizing:'border-box' }}
              onFocus={e=>{e.target.style.borderColor=Y;e.target.style.background='#fff';}}
              onBlur={e=>{e.target.style.borderColor=BORDER;e.target.style.background='#F9FAFB';}} />
          </div>
        )}
      </div>

      {view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem' }} className="album-grid">
          {Array.from({length:8}).map((_,i) => (
            <Card key={i} style={{ padding:0, overflow:'hidden' }}>
              <div style={{ height:140, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>💿</div>
              <div style={{ padding:'0.9rem' }}>
                <div style={{ width:'80%', height:12, background:'#F3F4F6', borderRadius:4, marginBottom:6 }} />
                <div style={{ width:'60%', height:10, background:'#F3F4F6', borderRadius:4, marginBottom:6 }} />
                <div style={{ width:'40%', height:10, background:'#F3F4F6', borderRadius:4, marginBottom:10 }} />
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
                  <Badge status={i%4===3?'Inactive':i%4===2?'Draft':'Active'} />
                  <RowActions active={i%4!==3} onEdit={()=>setModal('edit')} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card noPad>
          <Toolbar
            searchPlaceholder="Search by title, artist..."
            filters={['Active','Inactive','Draft']}
            sortOptions={['Title A–Z','Title Z–A','Newest','Oldest','Most Tracks']}
          />
          <Table headers={HEADERS} rows={rows} checkable />
          <Pagination label="Showing 1–10 of 0 albums" />
        </Card>
      )}
      <style>{`
        .album-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:1rem; }
        @media(max-width:640px) { .album-grid { grid-template-columns:repeat(2,1fr); gap:0.75rem; } }
        @media(max-width:400px) { .album-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default AlbumsPage;
