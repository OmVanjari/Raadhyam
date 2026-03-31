import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, SkeletonRows, Pagination, Badge, RowActions, Cover, Modal, FormGrid, Input, Select, Textarea, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Song','Artist','Album','Genre','Duration','Status','Actions'];

const SongForm = ({ title, onClose }) => (
  <Modal title={title} onClose={onClose} wide>
    <FormGrid>
      <Input label="Song Title"   placeholder="e.g. Midnight Echoes" required />
      <Input label="Artist Name"  placeholder="e.g. Luna Ray"        required />
      <Input label="Album"        placeholder="e.g. Neon Dreams" />
      <Select label="Genre" options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave']} required />
      <Input label="Duration"     placeholder="e.g. 3:45" />
      <Select label="Language"    options={['English','Hindi','Spanish','French','Japanese']} />
      <Select label="Status"      options={['Active','Inactive','Draft']} />
      <Input label="Release Date" type="date" />
    </FormGrid>
    <Textarea label="Description" placeholder="Short description of the song..." rows={3} />
    <UploadBox label="Audio File *" accept="MP3, WAV, FLAC — max 50MB" required />
    <UploadBox label="Cover Image"  accept="JPG, PNG, WEBP — max 5MB" />
    <FormActions submitLabel="Save Song" />
    <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
  </Modal>
);

const SongsPage = () => {
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'

  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <Cover size={34} />
      <div>
        <div style={{ width:100, height:11, background:'#F3F4F6', borderRadius:4, marginBottom:4 }} />
        <div style={{ width:70,  height:10, background:'#F3F4F6', borderRadius:4 }} />
      </div>
    </div>,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:90, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:40, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%3===2?'Inactive':i%3===1?'Draft':'Active'} />,
    <RowActions active={i%3!==2} onEdit={()=>setModal('edit')} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <SongForm title="Add New Song"  onClose={()=>setModal(null)} />}
      {modal==='edit' && <SongForm title="Edit Song"     onClose={()=>setModal(null)} />}

      <PageHeader title="Songs" subtitle="Manage all songs"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Add Song</PrimaryBtn>,
        ]} />

      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by title, artist, album..."
          filters={['Active','Inactive','Draft']}
          sortOptions={['Title A–Z','Title Z–A','Newest','Oldest','Most Played']}
        />
        <Table headers={HEADERS} rows={rows} checkable />
        <Pagination label="Showing 1–10 of 0 songs" />
      </Card>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default SongsPage;
