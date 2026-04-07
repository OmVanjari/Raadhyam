import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Modal, FormGrid, Input, Select, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Album','Artist','Genre','Year','Tracks','Status','Actions'];

/**
 * AlbumForm Component
 * Handles album creation/editing with integrated cover image upload
 */
const AlbumForm = ({ title, onClose, existingAlbum = null, onAlbumSaved }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: existingAlbum?.title || '',
    artist: existingAlbum?.artist || '',
    genre: existingAlbum?.genre || '',
    releaseYear: existingAlbum?.releaseYear || '',
    totalTracks: existingAlbum?.totalTracks || '',
    status: existingAlbum?.status || 'Active',
    label: existingAlbum?.label || '',
    upcCode: existingAlbum?.upcCode || '',
  });

  // Upload state - stores the uploaded cover image
  const [coverImage, setCoverImage] = useState(
    existingAlbum?.coverUrl 
      ? { url: existingAlbum.coverUrl, metadata: { originalName: existingAlbum.coverFileName, category: 'image' } } 
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

  // Handle cover image upload completion
  const handleCoverUpload = (result) => {
    if (result.error) {
      setSubmitError(`Cover image upload failed: ${result.error}`);
    } else {
      setCoverImage(result);
      setSubmitError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setSubmitError('Album title is required');
      return;
    }
    if (!formData.artist.trim()) {
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
      const albumData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
        totalTracks: formData.totalTracks ? parseInt(formData.totalTracks) : undefined,
        status: formData.status,
        label: formData.label,
        upcCode: formData.upcCode,
        coverUrl: coverImage?.url,
        coverFileName: coverImage?.metadata?.originalName,
        coverMetadata: coverImage?.metadata,
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
      const method = existingAlbum?._id ? 'PUT' : 'POST';
      const url = existingAlbum?._id 
        ? `/api/media/albums/${existingAlbum._id}` 
        : '/api/media/albums';

      // Make API call
      const response = await axios({
        method,
        url,
        data: albumData,
        headers
      });

      if (response.data && response.data.success) {
        console.log('Album saved successfully:', response.data);
        if (onAlbumSaved) onAlbumSaved();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to save album');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Failed to save album');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <FormGrid>
        <Input 
          label="Album Title" 
          placeholder="e.g. Neon Dreams" 
          required 
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <Input 
          label="Artist" 
          placeholder="e.g. Luna Ray" 
          required 
          value={formData.artist}
          onChange={(e) => handleInputChange('artist', e.target.value)}
        />
        <Select 
          label="Genre" 
          options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave','J-Pop']} 
          required 
          value={formData.genre}
          onChange={(e) => handleInputChange('genre', e.target.value)}
        />
        <Input 
          label="Release Year" 
          placeholder="e.g. 2025" 
          value={formData.releaseYear}
          onChange={(e) => handleInputChange('releaseYear', e.target.value)}
        />
        <Input 
          label="Total Tracks" 
          placeholder="e.g. 12" 
          type="number" 
          value={formData.totalTracks}
          onChange={(e) => handleInputChange('totalTracks', e.target.value)}
        />
        <Select 
          label="Status" 
          options={['Active','Inactive','Draft']}
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        />
        <Input 
          label="Label" 
          placeholder="Record label name" 
          value={formData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
        />
        <Input 
          label="UPC Code" 
          placeholder="Universal Product Code" 
          value={formData.upcCode}
          onChange={(e) => handleInputChange('upcCode', e.target.value)}
        />
      </FormGrid>

      {/* Album Cover Image Upload - preset 'image' */}
      <UploadBox 
        label="Album Cover *" 
        accept="image/jpeg,image/png,image/webp"
        preset="image"
        required
        value={coverImage}
        onUpload={handleCoverUpload}
        onRemove={() => setCoverImage(null)}
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
          {isSubmitting ? 'Saving...' : 'Save Album'}
        </PrimaryBtn>
        <OutlineBtn onClick={onClose} disabled={isSubmitting}>Cancel</OutlineBtn>
      </div>

      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col:grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

const AlbumsPage = () => {
  const [modal, setModal] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [view, setView] = useState('grid');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch albums from backend
  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/media/albums');
      
      if (response.data && response.data.success) {
        setAlbums(response.data.data?.albums || []);
      } else {
        setAlbums([]);
      }
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError(err.response?.data?.message || 'Failed to load albums');
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  // Load albums on mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Handler for when an album is saved
  const handleAlbumSaved = () => {
    fetchAlbums();
  };

  // Handler for editing an album
  const handleEdit = (album) => {
    setSelectedAlbum(album);
    setModal('edit');
  };

  // Generate table rows from albums data
  const rows = albums.map((album) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      {album.coverUrl ? (
        <img src={album.coverUrl} alt={album.title} style={{ width:34, height:34, borderRadius:6, objectFit:'cover' }} />
      ) : (
        <div style={{ width:34, height:34, borderRadius:6, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>💿</div>
      )}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: TEXT }}>{album.title || 'Untitled'}</div>
        <div style={{ fontSize: '0.72rem', color: MUTED }}>{album.artist || 'Unknown Artist'}</div>
      </div>
    </div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{album.artist || 'Unknown'}</div>,
    <Badge status={album.genre || 'Unknown'} />,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{album.releaseYear || '—'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{album.totalTracks || '—'}</div>,
    <Badge status={album.status || 'Active'} />,
    <RowActions active={album.status !== 'Inactive'} onEdit={() => handleEdit(album)} />,
  ]);

  if (loading && albums.length === 0) {
    return (
      <div style={{ fontFamily: SANS, display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: `3px solid ${Y}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: MUTED, fontSize: '0.85rem' }}>Loading albums...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <AlbumForm title="Add New Album" onClose={() => { setModal(null); setSelectedAlbum(null); }} onAlbumSaved={handleAlbumSaved} />}
      {modal==='edit' && <AlbumForm title="Edit Album"    onClose={() => { setModal(null); setSelectedAlbum(null); }} existingAlbum={selectedAlbum} onAlbumSaved={handleAlbumSaved} />}

      <PageHeader title="Albums" subtitle="Manage all albums"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={() => setModal('add')}>Add Album</PrimaryBtn>,
        ]} />

      {error && (
        <Card style={{ marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
        </Card>
      )}

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
          {albums.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: MUTED, gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '0.9rem' }}>No albums found. Click "Add Album" to create one.</p>
            </div>
          ) : (
            albums.map((album, i) => (
              <Card key={album._id || i} style={{ padding:0, overflow:'hidden' }}>
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} style={{ width:'100%', height:140, objectFit:'cover' }} />
                ) : (
                  <div style={{ height:140, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>💿</div>
                )}
                <div style={{ padding:'0.9rem' }}>
                  <div style={{ width:'80%', height:12, background:'#F3F4F6', borderRadius:4, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.85rem', fontWeight:600, color:TEXT }}>{album.title || 'Untitled'}</div>
                  <div style={{ width:'60%', height:10, background:'#F3F4F6', borderRadius:4, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.75rem', color:MUTED }}>{album.artist || 'Unknown'}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
                    <Badge status={album.status || 'Active'} />
                    <RowActions active={album.status !== 'Inactive'} onEdit={() => handleEdit(album)} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card noPad>
          <Toolbar
            searchPlaceholder="Search by title, artist..."
            filters={['Active','Inactive','Draft']}
            sortOptions={['Title A–Z','Title Z–A','Newest','Oldest','Most Tracks']}
          />
          {rows.length > 0 ? (
            <>
              <Table headers={HEADERS} rows={rows} checkable />
              <Pagination label={`Showing 1–${Math.min(10, rows.length)} of ${rows.length} albums`} />
            </>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
              <p style={{ fontSize: '0.9rem' }}>No albums found. Click "Add Album" to create one.</p>
            </div>
          )}
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