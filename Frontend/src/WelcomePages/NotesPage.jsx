import React, { useState, useEffect } from 'react';
import { Search, Music, X, Play, Share2, BookOpen, Clock, User } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBarPage from './NavBarpage';
import FooterPage from './FooterPage';

const MusicNotesPage = () => {
  const [musicNotes, setMusicNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { noteId } = useParams();
  const navigate = useNavigate();

  const categories = [
    'all',
    'guitar',
    'piano',
    'violin',
    'drums',
    'vocal',
    'bass',
    'ukulele'
  ];

  useEffect(() => {
    fetchMusicNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [musicNotes, searchTerm, selectedCategory]);

  useEffect(() => {
    if (noteId && musicNotes.length > 0) {
      const note = musicNotes.find(note => note._id === noteId);
      if (note) {
        setSelectedNote(note);
        setShowModal(true);
      }
    }
  }, [noteId, musicNotes]);

  const fetchMusicNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/music-notes');
      setMusicNotes(response.data.data || []);
    } catch (err) {
      setError('Failed to load music notes');
      console.error('Error fetching music notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = musicNotes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.explanation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.sections?.some(section =>
          section.lyrics?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.notation?.tabs?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    setFilteredNotes(filtered);
  };

  const openNoteModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
    navigate(`/music-notes/${note._id}`);
  };

  const closeNoteModal = () => {
    setSelectedNote(null);
    setShowModal(false);
    navigate('/Notes');
  };

  const shareNote = (note) => {
    const shareUrl = `${window.location.origin}/music-notes/${note._id}`;

    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: `Check out this music note: ${note.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard! Share this URL with others.');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      guitar: 'bg-red-500',
      piano: 'bg-blue-500',
      violin: 'bg-purple-500',
      drums: 'bg-orange-500',
      vocal: 'bg-pink-500',
      bass: 'bg-green-500',
      ukulele: 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      guitar: '🎸',
      piano: '🎹',
      violin: '🎻',
      drums: '🥁',
      vocal: '🎤',
      bass: '🎸',
      ukulele: '🪕'
    };
    return icons[category] || '🎵';
  };

  // Helper function to render content with grouped lyrics
  const renderContent = (sections) => {
    if (!sections) sections = [];
    if (!Array.isArray(sections)) sections = [sections];

    if (sections.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <Music className="w-14 h-14 mx-auto mb-4 text-gray-300" />
          No content available
        </div>
      );
    }

    return sections.map((section, index) => {
      const lyricsLines = section?.lyrics
        ? section.lyrics.split("\n").filter(line => line.trim() !== "")
        : [];

      const tabLines = section?.notation?.tabs
        ? section.notation.tabs.split("\n").filter(line => line.trim() !== "")
        : [];

      const maxLines = Math.max(lyricsLines.length, tabLines.length);

      return (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200"
        >
          {/* 🎵 Lyrics + Tabs + String Pattern */}
          <div className="space-y-1">
            {Array.from({ length: maxLines }).map((_, i) => (
              <div key={i} className="leading-tight">
                {/* Lyrics */}
                {lyricsLines[i] && (
                  <div className="text-gray-900 text-xl sm:text-xl font-medium leading-tight">
                    {lyricsLines[i]}
                  </div>
                )}

                {i === 0 && section?.notation?.string && (
                  <div className="mt-2 mb-3">
                    Strings Pattern : 
                    <span className=" text-blue-800 px-3 py-1 text-xs sm:text-sm font-medium">
                      {section.notation.string}
                    </span>
                  </div>
                )}

                {/* Tabs */}
                {tabLines[i] && (
                  <div className="font-mono text-green-700 text-sm sm:text-base tracking-wide -mt-1">
                    {tabLines[i]}
                  </div>
                )}

                {/* String Pattern - shown after tabs for the first line only */}

              </div>
            ))}


          </div>



          {/* Playing Techniques */}
          {section?.notation?.playingTechniques?.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
              <p className="font-semibold mb-2 text-xs">Playing Techniques : </p>
                {section.notation.playingTechniques.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-green-500 text-white px-3 py-1 rounded-md text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    });
  };



  if (loading) {
    return (
      <>
        <NavBarPage />
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading music notes...</p>
          </div>
        </div>
        <FooterPage />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBarPage />
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-4">
            <div className="text-red-600 text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchMusicNotes}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
        <FooterPage />
      </>
    );
  }

  return (
    <>
      <NavBarPage />

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Music Notes</h1>
                  <p className="text-gray-600">Discover and learn from our music collection</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No music notes available yet. Check back soon!'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => openNoteModal(note)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-red-500 to-orange-500 relative overflow-hidden">
                    {note.thumbnail ? (
                      <img
                        src={note.thumbnail}
                        alt={note.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-white opacity-80">
                          {getCategoryIcon(note.category)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`${getCategoryColor(note.category)} text-white px-3 py-1 rounded-full text-sm font-medium capitalize`}>
                        {note.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {note.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {note.explanation || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>{note.sections?.length || 0} sections</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Modal */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <button
                  onClick={closeNoteModal}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  <span className="hidden sm:inline">Back to Library</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => shareNote(selectedNote)}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm sm:text-base"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Note Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                {selectedNote.thumbnail && (
                  <img
                    src={selectedNote.thumbnail}
                    alt={selectedNote.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl object-cover mb-4 sm:mb-0 sm:mr-4 lg:mr-6"
                  />
                )}
                <div className="flex-1">
                  <span className={`inline-block ${getCategoryColor(selectedNote.category)} text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium capitalize mb-2`}>
                    {selectedNote.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {selectedNote.title}
                  </h1>
                </div>
              </div>
              {selectedNote.explanation && (
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  {selectedNote.explanation}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-6 sm:space-y-8">
              {renderContent(selectedNote.sections)}
            </div>

            {/* Mobile Action Button */}

          </div>
        </div>
      )}

      <FooterPage />
    </>
  );
};

export default MusicNotesPage;