import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Modal, Input, Select, Textarea, UploadBox, FormActions, SANS, MUTED, BORDER, Y, YL, TEXT } from '../components/UI';

const HEADERS = ['Playlist','Creator','Songs','Followers','Genre','Visibility','Status','Actions'];

/**
 * PlaylistForm Component
 * Handles playlist creation/editing with integrated cover image upload
 */
const PlaylistForm = ({ title, onClose, existingPlaylist = null, onPlaylistSaved }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: existingPlaylist?.name || '',
    genre: existingPlaylist?.genre || '',
    visibility: existingPlaylist?.visibility || 'Public',
    status: existingPlaylist?.status || 'Active',
    description: existingPlaylist?.description || '',
  });

  // Upload state
  const [coverImage, setCoverImage] = useState(
    existingPlaylist?.coverImageUrl 
      ? { url: existingPlaylist.coverImageUrl, metadata: { originalName: existingPlaylist.coverImageFileName, category: 'image' } } 
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
    if (!formData.name.trim()) {
      setSubmitError('Playlist name is required');
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
      const playlistData = {
        name: formData.name,
        genre: formData.genre,
        visibility: formData.visibility,
        status: formData.status,
        description: formData.description,
        coverImageUrl: coverImage?.url,
        coverImageFileName: coverImage?.metadata?.originalName,
        coverImageMetadata: coverImage?.metadata,
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
      const method = existingPlaylist?._id ? 'PUT' : 'POST';
      const url = existingPlaylist?._id 
        ? `/api/media/playlists/${existingPlaylist._id}` 
        : '/api/media/playlists';

      // Make API call
      const response = await axios({
        method,
        url,
        data: playlistData,
        headers
      });

      if (response.data && response.data.success) {
        console.log('Playlist saved successfully:', response.data);
        if (onPlaylistSaved) onPlaylistSaved();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to save playlist');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Failed to save playlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <Input label="Playlist Name" placeholder="e.g. Morning Vibes" required value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
      <Select label="Genre" options={['Mixed','Pop','Rock','Indie','Electronic','Synthwave','J-Pop','Hip-Hop','Jazz']} value={formData.genre} onChange={(e) => handleInputChange('genre', e.target.value)} />
      <Select label="Visibility" options={['Public','Private','Unlisted']} value={formData.visibility} onChange={(e) => handleInputChange('visibility', e.target.value)} />
      <Select label="Status" options={['Active','Inactive']} value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)} />
      <Textarea label="Description" placeholder="Short description..." rows={3} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
      
      {/* Cover Image Upload */}
      <UploadBox 
        label="Cover Image" 
        accept="image/jpeg,image/png,image/webp"
        preset="image"
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
          {isSubmitting ? 'Saving...' : 'Save Playlist'}
        </PrimaryBtn>
        <OutlineBtn onClick={onClose} disabled={isSubmitting}>Cancel</OutlineBtn>
      </div>
    </Modal>
  );
};

const PlaylistsPage = () => {
  const [modal, setModal] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch playlists from backend
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/media/playlists');
      
      if (response.data && response.data.success) {
        setPlaylists(response.data.data?.playlists || []);
      } else {
        setPlaylists([]);
      }
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError(err.response?.data?.message || 'Failed to load playlists');
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  // Load playlists on mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Handler for when a playlist is saved
  const handlePlaylistSaved = () => {
    fetchPlaylists();
  };

  // Handler for editing a playlist
  const handleEdit = (playlist) => {
    setSelectedPlaylist(playlist);
    setModal('edit');
  };

  // Generate table rows from playlists data
  const rows = playlists.map((playlist) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      {playlist.coverImageUrl ? (
        <img src={playlist.coverImageUrl} alt={playlist.name} style={{ width:34, height:34, borderRadius:6, objectFit:'cover' }} />
      ) : (
        <div style={{ width:34, height:34, borderRadius:6, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>🎶</div>
      )}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: TEXT }}>{playlist.name || 'Untitled'}</div>
        <div style={{ fontSize: '0.72rem', color: MUTED }}>{playlist.genre || 'Unknown Genre'}</div>
      </div>
    </div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{playlist.creatorName || 'Unknown'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{playlist.songs?.length || '0'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{playlist.followers?.toLocaleString() || '0'}</div>,
    <Badge status={playlist.genre || 'Unknown'} />,
    <Badge status={playlist.visibility || 'Public'} />,
    <Badge status={playlist.status || 'Active'} />,
    <RowActions active={playlist.status !== 'Inactive'} onEdit={() => handleEdit(playlist)} />,
  ]);

  if (loading && playlists.length === 0) {
    return (
      <div style={{ fontFamily: SANS, display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: `3px solid ${Y}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: MUTED, fontSize: '0.85rem' }}>Loading playlists...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <PlaylistForm title="Create Playlist" onClose={()=>{setModal(null);setSelectedPlaylist(null);}} onPlaylistSaved={handlePlaylistSaved} />}
      {modal==='edit' && <PlaylistForm title="Edit Playlist"   onClose={()=>{setModal(null);setSelectedPlaylist(null);}} existingPlaylist={selectedPlaylist} onPlaylistSaved={handlePlaylistSaved} />}

      <PageHeader title="Playlists" subtitle="Manage all playlists"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={()=>setModal('add')}>Create Playlist</PrimaryBtn>,
        ]} />

      {error && (
        <Card style={{ marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
        </Card>
      )}

      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by name, creator, genre..."
          filters={['Active','Inactive']}
          sortOptions={['Name A–Z','Name Z–A','Most Songs','Most Followers','Newest']}
        />
        {rows.length > 0 ? (
          <>
            <Table headers={HEADERS} rows={rows} checkable />
            <Pagination label={`Showing 1–${Math.min(10, rows.length)} of ${rows.length} playlists`} />
          </>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
            <p style={{ fontSize: '0.9rem' }}>No playlists found. Click "Create Playlist" to create one.</p>
          </div>
        )}
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