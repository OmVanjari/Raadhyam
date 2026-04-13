import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Avatar, Modal, FormGrid, Input, Select, Textarea, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Artist','Genre','Country','Followers','Songs','Albums','Status','Actions'];

/**
 * ArtistForm Component
 * Handles artist creation/editing with integrated profile photo upload
 */
const ArtistForm = ({ title, onClose, existingArtist = null, onArtistSaved }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: existingArtist?.name || '',
    genre: existingArtist?.genre || '',
    country: existingArtist?.country || '',
    debutYear: existingArtist?.debutYear || '',
    email: existingArtist?.email || '',
    website: existingArtist?.website || '',
    status: existingArtist?.status || 'Active',
    monthlyListeners: existingArtist?.monthlyListeners || '',
    bio: existingArtist?.bio || '',
  });

  // Upload state
  const [profilePhoto, setProfilePhoto] = useState(
    existingArtist?.profilePhotoUrl 
      ? { url: existingArtist.profilePhotoUrl, metadata: { originalName: existingArtist.profilePhotoFileName, category: 'image' } } 
      : null
  );

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Get auth token for API calls
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle profile photo upload completion
  const handlePhotoUpload = (result) => {
    if (result.error) {
      setSubmitError(`Profile photo upload failed: ${result.error}`);
    } else {
      setProfilePhoto(result);
      setSubmitError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setSubmitError('Artist name is required');
      return;
    }
    if (!formData.genre) {
      setSubmitError('Genre is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API call
      const artistData = {
        name: formData.name,
        genre: formData.genre,
        country: formData.country,
        debutYear: formData.debutYear ? parseInt(formData.debutYear) : undefined,
        email: formData.email,
        website: formData.website,
        status: formData.status,
        monthlyListeners: formData.monthlyListeners ? parseInt(formData.monthlyListeners) : undefined,
        bio: formData.bio,
        profilePhotoUrl: profilePhoto?.url,
        profilePhotoFileName: profilePhoto?.metadata?.originalName,
        profilePhotoMetadata: profilePhoto?.metadata,
      };

      // Get auth token
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = token;
      }

      // Determine if creating or updating
      const method = existingArtist?._id ? 'PUT' : 'POST';
      const url = existingArtist?._id 
        ? `/api/media/artists/${existingArtist._id}` 
        : '/api/media/artists';

      // Make API call
      const response = await axios({
        method,
        url,
        data: artistData,
        headers
      });

      if (response.data && response.data.success) {
        console.log('Artist saved successfully:', response.data);
        if (onArtistSaved) onArtistSaved();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to save artist');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Failed to save artist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <FormGrid>
        <Input label="Artist Name"  placeholder="e.g. Luna Ray"       required value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
        <Select label="Genre" options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave','J-Pop']} required value={formData.genre} onChange={(e) => handleInputChange('genre', e.target.value)} />
        <Input label="Country"      placeholder="e.g. United States" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} />
        <Input label="Debut Year"   placeholder="e.g. 2018" value={formData.debutYear} onChange={(e) => handleInputChange('debutYear', e.target.value)} />
        <Input label="Email"        placeholder="artist@email.com" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
        <Input label="Website"      placeholder="https://..." value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
        <Select label="Status"      options={['Active','Inactive']} value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)} />
        <Input label="Monthly Listeners" placeholder="e.g. 2,100,000" type="number" value={formData.monthlyListeners} onChange={(e) => handleInputChange('monthlyListeners', e.target.value)} />
      </FormGrid>
      <Textarea label="Bio" placeholder="Short artist biography..." rows={3} value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} />
      
      {/* Profile Photo Upload */}
      <UploadBox 
        label="Profile Photo" 
        accept="image/jpeg,image/png,image/webp"
        preset="image"
        value={profilePhoto}
        onUpload={handlePhotoUpload}
        onRemove={() => setProfilePhoto(null)}
      />

      {/* Error message */}
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

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: '0.5rem', paddingTop: '1rem', borderTop: `1px solid ${BORDER}` }}>
        <PrimaryBtn onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Artist'}
        </PrimaryBtn>
        <OutlineBtn onClick={onClose} disabled={isSubmitting}>Cancel</OutlineBtn>
      </div>

      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col:grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

const ArtistsPage = () => {
  const [modal, setModal] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [view, setView] = useState('table');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch artists from backend
  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/media/artists');
      
      if (response.data && response.data.success) {
        setArtists(response.data.data?.artists || []);
      } else {
        setArtists([]);
      }
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError(err.response?.data?.message || 'Failed to load artists');
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  // Load artists on mount
  useEffect(() => {
    fetchArtists();
  }, []);

  // Handler for when an artist is saved
  const handleArtistSaved = () => {
    fetchArtists();
  };

  // Handler for editing an artist
  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setModal('edit');
  };

  // Generate table rows from artists data
  const rows = artists.map((artist) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      {artist.profilePhotoUrl ? (
        <img src={artist.profilePhotoUrl} alt={artist.name} style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover' }} />
      ) : (
        <Avatar name={artist.name?.charAt(0) || 'A'} size={34} />
      )}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: TEXT }}>{artist.name || 'Untitled'}</div>
        <div style={{ fontSize: '0.72rem', color: MUTED }}>{artist.genre || 'Unknown Genre'}</div>
      </div>
    </div>,
    <Badge status={artist.genre || 'Unknown'} />,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{artist.country || '—'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{artist.monthlyListeners?.toLocaleString() || '—'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{artist.songs?.length || '—'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{artist.albums?.length || '—'}</div>,
    <Badge status={artist.status || 'Active'} />,
    <RowActions active={artist.status !== 'Inactive'} onEdit={() => handleEdit(artist)} />,
  ]);

  if (loading && artists.length === 0) {
    return (
      <div style={{ fontFamily: SANS, display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: `3px solid ${Y}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: MUTED, fontSize: '0.85rem' }}>Loading artists...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <ArtistForm title="Add New Artist" onClose={()=>{setModal(null);setSelectedArtist(null);}} onArtistSaved={handleArtistSaved} />}
      {modal==='edit' && <ArtistForm title="Edit Artist"    onClose={()=>{setModal(null);setSelectedArtist(null);}} existingArtist={selectedArtist} onArtistSaved={handleArtistSaved} />}

      <PageHeader title="Artists" subtitle="Manage all artists"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Add Artist</PrimaryBtn>,
        ]} />

      {error && (
        <Card style={{ marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
        </Card>
      )}

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
          {rows.length > 0 ? (
            <>
              <Table headers={HEADERS} rows={rows} checkable />
              <Pagination label={`Showing 1–${Math.min(10, rows.length)} of ${rows.length} artists`} />
            </>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
              <p style={{ fontSize: '0.9rem' }}>No artists found. Click "Add Artist" to create one.</p>
            </div>
          )}
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
            {artists.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: MUTED, gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '0.9rem' }}>No artists found. Click "Add Artist" to create one.</p>
              </div>
            ) : (
              artists.map((artist, i) => (
                <Card key={artist._id || i} style={{ textAlign:'center', padding:'1.5rem 1rem' }}>
                  {artist.profilePhotoUrl ? (
                    <img src={artist.profilePhotoUrl} alt={artist.name} style={{ width:56, height:56, borderRadius:'50%', objectFit:'cover', margin:'0 auto 0.75rem' }} />
                  ) : (
                    <Avatar name={artist.name?.charAt(0) || 'A'} size={56} style={{ margin:'0 auto 0.75rem' }} />
                  )}
                  <div style={{ width:'80%', height:13, background:'#F3F4F6', borderRadius:4, margin:'0 auto 6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.9rem', fontWeight:600, color:TEXT }}>{artist.name || 'Untitled'}</div>
                  <div style={{ width:'60%', height:11, background:'#F3F4F6', borderRadius:4, margin:'0 auto 10px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.75rem', color:MUTED }}>{artist.genre || 'Unknown'}</div>
                  <Badge status={artist.status || 'Active'} />
                  <div style={{ display:'flex', justifyContent:'center', gap:4, marginTop:10, flexWrap:'wrap' }}>
                    <RowActions active={artist.status !== 'Inactive'} onEdit={() => handleEdit(artist)} />
                  </div>
                </Card>
              ))
            )}
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