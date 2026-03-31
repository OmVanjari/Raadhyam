import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Modal, Input, Select, Textarea, UploadBox, FormActions, SANS, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Playlist','Creator','Songs','Followers','Genre','Visibility','Status','Actions'];

const PlaylistForm = ({ title, onClose }) => (
  <Modal title={title} onClose={onClose}>
    <Input label="Playlist Name" placeholder="e.g. Morning Vibes" required />
    <Select label="Genre" options={['Mixed','Pop','Rock','Indie','Electronic','Synthwave','J-Pop','Hip-Hop','Jazz']} />
    <Select label="Visibility" options={['Public','Private','Unlisted']} />
    <Select label="Status" options={['Active','Inactive']} />
    <Textarea label="Description" placeholder="Short description..." rows={3} />
    <UploadBox label="Cover Image" accept="JPG, PNG, WEBP — max 5MB" />
    <FormActions submitLabel="Save Playlist" />
  </Modal>
);

const PlaylistsPage = () => {
  const [modal, setModal] = useState(null);

  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <div style={{ width:34, height:34, borderRadius:6, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>🎶</div>
      <div style={{ width:100, height:11, background:'#F3F4F6', borderRadius:4 }} />
    </div>,
    <div style={{ width:70, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:30, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:50, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:55, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%3===2?'Inactive':'Active'} />,
    <RowActions active={i%3!==2} onEdit={()=>setModal('edit')} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <PlaylistForm title="Create Playlist" onClose={()=>setModal(null)} />}
      {modal==='edit' && <PlaylistForm title="Edit Playlist"   onClose={()=>setModal(null)} />}

      <PageHeader title="Playlists" subtitle="Manage all playlists"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Create Playlist</PrimaryBtn>,
        ]} />

      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by name, creator, genre..."
          filters={['Active','Inactive']}
          sortOptions={['Name A–Z','Name Z–A','Most Songs','Most Followers','Newest']}
        />
        <Table headers={HEADERS} rows={rows} checkable />
        <Pagination label="Showing 1–10 of 0 playlists" />
      </Card>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default PlaylistsPage;
