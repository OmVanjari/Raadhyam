import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Avatar, StatCard, Modal, FormGrid, Input, Select, FormActions, SANS, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['User','Email','Plan','Streams','Status','Joined','Actions'];

const UserForm = ({ title, onClose }) => (
  <Modal title={title} onClose={onClose} wide>
    <FormGrid>
      <Input label="Full Name"  placeholder="e.g. Arjun Mehta"       required />
      <Input label="Email"      placeholder="user@email.com" type="email" required />
      <Input label="Phone"      placeholder="+91 00000 00000" />
      <Input label="Country"    placeholder="e.g. India" />
      <Select label="Plan"      options={['Free','Monthly Premium','Annual Premium']} />
      <Select label="Status"    options={['Active','Inactive','Suspended']} />
      <Input label="Password"   placeholder="Set password" type="password" />
      <Input label="Confirm Password" placeholder="Confirm password" type="password" />
    </FormGrid>
    <FormActions submitLabel="Save User" />
    <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
  </Modal>
);

const UsersPage = () => {
  const [modal, setModal] = useState(null);

  const rows = Array.from({length:6}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <Avatar name="U" size={32} />
      <div style={{ width:90, height:11, background:'#F3F4F6', borderRadius:4 }} />
    </div>,
    <div style={{ width:130, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%3===0?'Premium':i%3===1?'Free':'Free'} />,
    <div style={{ width:50, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%4===3?'Inactive':'Active'} />,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <RowActions active={i%4!==3} onEdit={()=>setModal('edit')} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <UserForm title="Add New User" onClose={()=>setModal(null)} />}
      {modal==='edit' && <UserForm title="Edit User"    onClose={()=>setModal(null)} />}

      <PageHeader title="Users" subtitle="Manage registered users"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Add User</PrimaryBtn>,
        ]} />

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.25rem' }} className="user-stats">
        <StatCard label="Total Users"    icon="👥" color="#3B82F6" bg="#EFF6FF" />
        <StatCard label="Premium Users"  icon="⭐" color="#8B5CF6" bg="#F5F3FF" />
        <StatCard label="Active Today"   icon="🟢" color="#10B981" bg="#ECFDF5" />
        <StatCard label="New This Month" icon="📈" color={Y}       bg={YL}      />
      </div>

      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by name, email..."
          filters={['Active','Inactive','Suspended']}
          sortOptions={['Name A–Z','Name Z–A','Newest','Oldest','Most Streams']}
        />
        {/* Plan filter tabs */}
        <div className="filter-tabs" style={{ display:'flex', gap:6, padding:'0.75rem 1.25rem', borderBottom:`1px solid ${BORDER}`, flexWrap:'wrap' }}>
          {['All Plans','Free','Monthly Premium','Annual Premium'].map((f,i) => (
            <button key={f} style={{ padding:'5px 12px', borderRadius:8, border:`1.5px solid ${i===0?Y:BORDER}`, background:i===0?Y:'#fff', color:i===0?'#fff':MUTED, fontSize:'0.78rem', fontWeight:600, cursor:'pointer', fontFamily:SANS, whiteSpace:'nowrap' }}>{f}</button>
          ))}
        </div>
        <Table headers={HEADERS} rows={rows} checkable />
        <Pagination label="Showing 1–10 of 0 users" />
      </Card>
      <style>{`@media(max-width:768px){.user-stats{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.user-stats{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default UsersPage;
