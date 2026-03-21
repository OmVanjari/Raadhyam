import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Upload, File } from 'lucide-react';
import axios from 'axios';

const NoteFormModal = ({ 
  editingNote, 
  setShowNoteForm, 
  fetchMusicNotes, 
  fetchDashboardStats 
}) => {
  const [noteForm, setNoteForm] = useState(editingNote || getInitialNoteForm());
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Get axios config with auth headers
  const getAxiosConfig = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  // File upload function
  const uploadFile = async (file, type = 'image') => {
    if (!file) return null;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await axios.post('/api/admin/upload/thumbnail', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Create music note API
  const createMusicNote = async (noteData) => {
    try {
      const response = await axios.post('/api/admin/music-notes', noteData, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Error creating music note:', error);
      throw new Error(error.response?.data?.message || 'Error creating music note. Please try again.');
    }
  };

  // Update music note API
  const updateMusicNote = async (id, noteData) => {
    try {
      const response = await axios.put(`/api/admin/music-notes/${id}`, noteData, getAxiosConfig());
      return response.data;
    } catch (error) {
      console.error('Error updating music note:', error);
      throw new Error(error.response?.data?.message || 'Error updating music note. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Upload thumbnail if a new file was selected
      let thumbnailUrl = noteForm.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, 'image');
      }

      // Prepare note data according to schema
      const noteData = {
        title: noteForm.title,
        category: noteForm.category,
        thumbnail: thumbnailUrl,
        explanation: noteForm.explanation || '',
        sections: noteForm.sections.map(section => ({
          lyrics: section.lyrics || '',
          notation: {
            tabs: section.notation.tabs || '',
            string: section.notation.string || '',
            level: section.notation.level || 'beginner',
            playingTechniques: section.notation.playingTechniques || []
          }
        }))
      };

      // Remove empty sections (sections with no lyrics and no tabs)
      noteData.sections = noteData.sections.filter(section => 
        section.lyrics || section.notation.tabs
      );

      if (editingNote) {
        await updateMusicNote(editingNote._id, noteData);
        alert('Music note updated successfully!');
      } else {
        await createMusicNote(noteData);
        alert('Music note created successfully!');
      }
      
      // Refresh data
      if (fetchMusicNotes) await fetchMusicNotes();
      if (fetchDashboardStats) await fetchDashboardStats();
      
      setShowNoteForm(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file) => {
    setThumbnailFile(file);
  };

  // Helper function to check if we have a thumbnail to display
  const getThumbnailPreview = () => {
    if (thumbnailFile) {
      return URL.createObjectURL(thumbnailFile);
    }
    return noteForm.thumbnail; // This is the URL string from the database
  };

  const thumbnailPreview = getThumbnailPreview();

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {editingNote ? 'Edit Music Note' : 'Create New Music Note'}
          </h2>
          <button 
            onClick={() => setShowNoteForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={noteForm.title}
                onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter music note title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={noteForm.category}
                onChange={(e) => setNoteForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="guitar">Guitar</option>
                <option value="piano">Piano</option>
                <option value="violin">Violin</option>
                <option value="drums">Drums</option>
                <option value="vocal">Vocal</option>
                <option value="bass">Bass</option>
                <option value="ukulele">Ukulele</option>
              </select>
            </div>
          </div>

          {/* Global Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation/Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={noteForm.explanation}
              onChange={(e) => setNoteForm(prev => ({ ...prev, explanation: e.target.value }))}
              placeholder="Enter overall explanation or description for this music note..."
            />
          </div>
            
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  disabled={uploading}
                />
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  uploading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400 cursor-pointer'
                }`}>
                  <Upload size={24} className={`mx-auto mb-2 ${uploading ? 'text-gray-400' : 'text-gray-400'}`} />
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 
                     thumbnailFile ? thumbnailFile.name : 
                     noteForm.thumbnail ? 'Change thumbnail' : 
                     'Click to upload thumbnail'}
                  </p>
                  {thumbnailFile && !uploading && (
                    <p className="text-xs text-green-600 mt-1">
                      New file selected: {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  {uploading && (
                    <p className="text-xs text-blue-600 mt-1">
                      Please wait while file uploads...
                    </p>
                  )}
                </div>
              </label>
              {thumbnailPreview && (
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={thumbnailPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            {noteForm.thumbnail && !thumbnailFile && (
              <p className="text-sm text-gray-500 mt-2">
                Current thumbnail uploaded
              </p>
            )}
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Song Sections</label>
              <span className="text-sm text-gray-500">
                {noteForm.sections.length} section{noteForm.sections.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {noteForm.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Section {sectionIndex + 1}</h4>
                  {noteForm.sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setNoteForm(prev => ({
                        ...prev,
                        sections: prev.sections.filter((_, i) => i !== sectionIndex)
                      }))}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* Lyrics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lyrics</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={section.lyrics}
                      onChange={(e) => {
                        const newSections = [...noteForm.sections];
                        newSections[sectionIndex].lyrics = e.target.value;
                        setNoteForm(prev => ({ ...prev, sections: newSections }));
                      }}
                      placeholder="Enter song lyrics for this section..."
                    />
                  </div>
                  
                  {/* Notation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tabs/Notation *</label>
                      <textarea
                        rows={4}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        value={section.notation.tabs}
                        onChange={(e) => {
                          const newSections = [...noteForm.sections];
                          newSections[sectionIndex].notation.tabs = e.target.value;
                          setNoteForm(prev => ({ ...prev, sections: newSections }));
                        }}
                        placeholder="Enter music tabs or notation for this section..."
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">String/Tuning</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={section.notation.string}
                          onChange={(e) => {
                            const newSections = [...noteForm.sections];
                            newSections[sectionIndex].notation.string = e.target.value;
                            setNoteForm(prev => ({ ...prev, sections: newSections }));
                          }}
                          placeholder="e.g., Standard Tuning, Drop D, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={section.notation.level}
                          onChange={(e) => {
                            const newSections = [...noteForm.sections];
                            newSections[sectionIndex].notation.level = e.target.value;
                            setNoteForm(prev => ({ ...prev, sections: newSections }));
                          }}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Playing Techniques */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Playing Techniques</label>
                    <div className="flex flex-wrap gap-2">
                      {['hammer-on', 'pull-off', 'slide', 'bend', 'vibrato', 'palm mute', 'fingerstyle', 'strumming'].map(technique => (
                        <label key={technique} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={section.notation.playingTechniques?.includes(technique) || false}
                            onChange={(e) => {
                              const newSections = [...noteForm.sections];
                              const currentTechniques = newSections[sectionIndex].notation.playingTechniques || [];
                              
                              if (e.target.checked) {
                                newSections[sectionIndex].notation.playingTechniques = [...currentTechniques, technique];
                              } else {
                                newSections[sectionIndex].notation.playingTechniques = currentTechniques.filter(t => t !== technique);
                              }
                              
                              setNoteForm(prev => ({ ...prev, sections: newSections }));
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 capitalize">{technique}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => setNoteForm(prev => ({
                ...prev,
                sections: [...prev.sections, {
                  lyrics: '',
                  notation: { 
                    tabs: '', 
                    string: '', 
                    level: 'beginner', 
                    playingTechniques: [] 
                  }
                }]
              }))}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Plus size={20} className="mr-2" />
              Add Section
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Add multiple sections for different parts of the song (verse, chorus, bridge, etc.)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowNoteForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingNote ? 'Updating...' : 'Creating...'}
                </>
              ) : uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {editingNote ? 'Update Music Note' : 'Create Music Note'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function for initial note form
const getInitialNoteForm = () => ({
  title: '',
  category: 'guitar',
  thumbnail: '',
  explanation: '',
  sections: [{
    lyrics: '',
    notation: { 
      tabs: '', 
      string: '', 
      level: 'beginner', 
      playingTechniques: [] 
    }
  }]
});

export default NoteFormModal;