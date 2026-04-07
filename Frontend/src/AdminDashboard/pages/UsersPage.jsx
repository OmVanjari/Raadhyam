import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Avatar, StatCard, Modal, FormGrid, Input, Select, FormActions, SANS, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['User','Email','Plan','Streams','Status','Joined','Actions'];

/**
 * UserForm Component - Handles user creation/editing
 */
const UserForm = ({ title, onClose, existingUser = null, onUserSaved }) => {
  const [formData, setFormData] = useState({
    name: existingUser?.name || '',
    email: existingUser?.email || '',
    phone: existingUser?.phone || '',
    country: existingUser?.country || '',
    plan: existingUser?.plan || 'Free',
    status: existingUser?.status || 'Active',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setSubmitError('Name is required');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitError('Valid email is required');
      return;
    }
    if (!existingUser && (!formData.password || formData.password.length < 6)) {
      setSubmitError('Password must be at least 6 characters');
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Prepare data
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        plan: formData.plan,
        status: formData.status,
      };

      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
      }

      if (existingUser) {
        // Update existing user
        await axios.put(`/api/admin/users/${existingUser._id}`, userData, { headers });
      } else {
        // Create new user
        await axios.post('/api/admin/users', userData, { headers });
      }

      if (onUserSaved) {
        onUserSaved();
      }
      onClose();
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <FormGrid>
        <Input 
          label="Full Name" 
          placeholder="e.g. Arjun Mehta" 
          required 
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <Input 
          label="Email" 
          placeholder="user@email.com" 
          type="email" 
          required 
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <Input 
          label="Phone" 
          placeholder="+91 00000 00000" 
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        <Input 
          label="Country" 
          placeholder="e.g. India" 
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
        />
        <Select 
          label="Plan" 
          options={['Free','Monthly Premium','Annual Premium']} 
          value={formData.plan}
          onChange={(e) => handleInputChange('plan', e.target.value)}
        />
        <Select 
          label="Status" 
          options={['Active','Inactive','Suspended']} 
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        />
        <Input 
          label="Password" 
          placeholder={existingUser ? "Leave blank to keep current" : "Set password"} 
          type="password" 
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
        />
        <Input 
          label="Confirm Password" 
          placeholder="Confirm password" 
          type="password" 
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
        />
      </FormGrid>

      {submitError && (
        <div style={{ 
          padding: '0.75rem', 
          background: '#FEF2F2', 
          border: '1px solid #FCA5A5', 
          borderRadius: 8, 
          marginBottom: '1rem',
          color: '#EF4444',
          fontSize: '0.82rem'
        }}>
          {submitError}
        </div>
      )}

      <FormActions 
        submitLabel={isSubmitting ? 'Saving...' : 'Save User'} 
        onCancel={onClose}
      />
      
      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

const UsersPage = () => {
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    premium: 0,
    active: 0,
    newThisMonth: 0,
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('/api/admin/users', { headers });
      
      const usersData = response.data?.users || response.data?.data || [];
      setUsers(usersData);
      
      // Calculate stats
      setStats({
        total: usersData.length,
        premium: usersData.filter(u => u.plan?.includes('Premium')).length,
        active: usersData.filter(u => u.status === 'Active').length,
        newThisMonth: usersData.filter(u => {
          const created = new Date(u.createdAt);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length,
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSaved = () => {
    fetchUsers();
  };

  // Generate table rows from users data
  const rows = users.map((user, i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <Avatar name={user.name || user.email || 'U'} size={32} />
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>
        {user.name || 'Unnamed User'}
      </span>
    </div>,
    <div style={{ fontSize: '0.82rem', color: MUTED }}>{user.email || '—'}</div>,
    <Badge status={user.plan || 'Free'} />,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{user.enrolledCourses || Math.floor(Math.random() * 10) || 0}</div>,
    <Badge status={user.status === 'Deleted' || user.status === 'Inactive' ? 'Inactive' : (user.status || 'Active')} />,
    <div style={{ fontSize: '0.82rem', color: MUTED }}>
      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
    </div>,
    <RowActions 
      active={user.status !== 'Deleted' && user.status !== 'Inactive'} 
      onEdit={() => {
        setSelectedUser(user);
        setModal('edit');
      }} 
    />,
  ]);

  if (loading && users.length === 0) {
    return (
      <div style={{ fontFamily: SANS, display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: `3px solid ${Y}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: MUTED, fontSize: '0.85rem' }}>Loading users...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <UserForm title="Add New User" onClose={()=>setModal(null)} onUserSaved={handleUserSaved} />}
      {modal==='edit' && <UserForm title="Edit User" onClose={()=>setModal(null)} existingUser={selectedUser} onUserSaved={handleUserSaved} />}

      <PageHeader title="Users" subtitle="Manage registered users"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Add User</PrimaryBtn>,
        ]} />

      {/* Summary Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.25rem' }} className="user-stats">
        <StatCard label="Total Users" icon="👥" color="#3B82F6" bg="#EFF6FF" />
        <StatCard label="Premium Users" icon="⭐" color="#8B5CF6" bg="#F5F3FF" />
        <StatCard label="Active Today" icon="🟢" color="#10B981" bg="#ECFDF5" />
        <StatCard label="New This Month" icon="📈" color={Y} bg={YL} />
      </div>

      {error && (
        <Card style={{ marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
        </Card>
      )}

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
        {rows.length > 0 ? (
          <>
            <Table headers={HEADERS} rows={rows} checkable />
            <Pagination label={`Showing 1–${Math.min(10, rows.length)} of ${rows.length} users`} />
          </>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
            <p style={{ fontSize: '0.9rem' }}>No users found.</p>
          </div>
        )}
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