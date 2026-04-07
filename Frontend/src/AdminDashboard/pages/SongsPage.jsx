import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, SkeletonRows, Pagination, Badge, RowActions, Cover, Modal, FormGrid, Input, Select, Textarea, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Song','Artist','Album','Genre','Duration','Status','Actions'];

/**
 * SongForm Component
 * Handles song creation/editing with integrated upload functionality
 */
const SongForm = ({ title, onClose, existingSong = null, onSongSaved }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: existingSong?.title || '',
    artist: existingSong?.artist || '',
    album: existingSong?.album || '',
    genre: existingSong?.genre || '',
    duration: existingSong?.duration || '',
    language: existingSong?.language || '',
    status: existingSong?.status || 'Active',
    releaseDate: existingSong?.releaseDate || '',
    description: existingSong?.description || '',
  });

  // Upload state - stores the uploaded file URLs
  const [audioFile, setAudioFile] = useState(
    existingSong?.fileUrl ? { url: existingSong.fileUrl, metadata: { originalName: existingSong.audioFileName || 'audio' } } : null
  );
  const [coverImage, setCoverImage] = useState(
    existingSong?.thumbnailUrl ? { url: existingSong.thumbnailUrl, metadata: { originalName: existingSong.coverFileName || 'cover', category: 'image' } } : null
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

  // Handle audio file upload completion
  const handleAudioUpload = (result) => {
    if (result.error) {
      setSubmitError(`Audio upload failed: ${result.error}`);
    } else {
      setAudioFile(result);
      setSubmitError(null);
    }
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
      setSubmitError('Song title is required');
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
    if (!audioFile) {
      setSubmitError('Audio file is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API call to /api/music
      // Backend expects: title, artist, fileUrl (required), duration, publicId, thumbnailUrl, album, genre
      const songData = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
        genre: formData.genre,
        duration: formData.duration,
        // Backend expects 'fileUrl' not 'audioUrl'
        fileUrl: audioFile.url,
        publicId: audioFile.metadata?.public_id || null,
        thumbnailUrl: coverImage?.url || null,
        // Additional metadata for frontend display
        language: formData.language,
        status: formData.status,
        releaseDate: formData.releaseDate,
        description: formData.description,
      };

      // Use axios for API call with proper auth
      const token = getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await axios.post('/api/music', songData, { headers });

      if (response.data && response.data.success) {
        console.log('Song saved successfully:', response.data);
        // Notify parent component of successful save
        if (onSongSaved) {
          onSongSaved(response.data);
        }
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to save song');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || error.message || 'Failed to save song');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <FormGrid>
        <Input 
          label="Song Title" 
          placeholder="e.g. Midnight Echoes" 
          required 
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <Input 
          label="Artist Name" 
          placeholder="e.g. Luna Ray" 
          required 
          value={formData.artist}
          onChange={(e) => handleInputChange('artist', e.target.value)}
        />
        <Input 
          label="Album" 
          placeholder="e.g. Neon Dreams" 
          value={formData.album}
          onChange={(e) => handleInputChange('album', e.target.value)}
        />
        <Select 
          label="Genre" 
          options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave']} 
          required 
          value={formData.genre}
          onChange={(e) => handleInputChange('genre', e.target.value)}
        />
        <Input 
          label="Duration" 
          placeholder="e.g. 3:45" 
          value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
        />
        <Select 
          label="Language" 
          options={['English','Hindi','Spanish','French','Japanese']}
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
        />
        <Select 
          label="Status" 
          options={['Active','Inactive','Draft']}
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        />
        <Input 
          label="Release Date" 
          type="date" 
          value={formData.releaseDate}
          onChange={(e) => handleInputChange('releaseDate', e.target.value)}
        />
      </FormGrid>
      <Textarea 
        label="Description" 
        placeholder="Short description of the song..." 
        rows={3}
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
      />

      {/* Audio File Upload - preset 'audio' */}
      <UploadBox 
        label="Audio File *" 
        accept="audio/mpeg,audio/wav,audio/ogg,audio/flac"
        preset="audio"
        required
        value={audioFile}
        onUpload={handleAudioUpload}
        onRemove={() => setAudioFile(null)}
      />

      {/* Cover Image Upload - preset 'image' */}
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
          {isSubmitting ? 'Saving...' : 'Save Song'}
        </PrimaryBtn>
        <OutlineBtn onClick={onClose} disabled={isSubmitting}>Cancel</OutlineBtn>
      </div>

      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

const SongsPage = () => {
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selectedSong, setSelectedSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch songs from backend
  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('/api/music', { headers });
      
      if (response.data && response.data.success) {
        setSongs(response.data.songs || response.data.data || []);
      } else {
        setSongs([]);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError(err.response?.data?.message || 'Failed to load songs');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load songs on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Handler for when a song is saved
  const handleSongSaved = () => {
    fetchSongs(); // Refresh the list
  };

  // Generate table rows from songs data
  const rows = songs.map((song) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <Cover size={34} />
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: TEXT }}>{song.title || 'Untitled'}</div>
        <div style={{ fontSize: '0.72rem', color: MUTED }}>{song.artist || 'Unknown Artist'}</div>
      </div>
    </div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{song.artist || 'Unknown'}</div>,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{song.album || '—'}</div>,
    <Badge status={song.genre || 'Unknown'} />,
    <div style={{ fontSize: '0.82rem', color: TEXT }}>{song.duration || '—'}</div>,
    <Badge status={song.status || 'Active'} />,
    <RowActions 
      active={song.status !== 'Inactive'} 
      onEdit={() => {
        setSelectedSong(song);
        setModal('edit');
      }} 
    />,
  ]);

  if (loading && songs.length === 0) {
    return (
      <div style={{ fontFamily: SANS, display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: `3px solid ${Y}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: MUTED, fontSize: '0.85rem' }}>Loading songs...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <SongForm title="Add New Song"  onClose={() => { setModal(null); setSelectedSong(null); }} onSongSaved={handleSongSaved} />}
      {modal==='edit' && <SongForm title="Edit Song"     onClose={() => { setModal(null); setSelectedSong(null); }} existingSong={selectedSong} onSongSaved={handleSongSaved} />}

      <PageHeader title="Songs" subtitle="Manage all songs"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={() => setModal('add')}>Add Song</PrimaryBtn>,
        ]} />

      {error && (
        <Card style={{ marginBottom: '1rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>
        </Card>
      )}
      
      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by title, artist, album..."
          filters={['Active','Inactive','Draft']}
          sortOptions={['Title A–Z','Title Z–A','Newest','Oldest','Most Played']}
        />
        {rows.length > 0 ? (
          <>
            <Table headers={HEADERS} rows={rows} checkable />
            <Pagination label={`Showing 1–${Math.min(10, rows.length)} of ${rows.length} songs`} />
          </>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: MUTED }}>
            <p style={{ fontSize: '0.9rem' }}>No songs found. Click "Add Song" to create one.</p>
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

export default SongsPage;
