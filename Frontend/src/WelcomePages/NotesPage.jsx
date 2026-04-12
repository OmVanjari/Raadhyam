import React, { useState, useEffect } from 'react';
import { Search, Music, X, Play, Share2, BookOpen, Clock, User } from 'lucide-react';
import axios from 'axios';
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
    window.history.pushState({ noteModal: true }, '');
  };

  const closeNoteModal = () => {
    setSelectedNote(null);
    setShowModal(false);
  };

  // Handle browser back button — close modal instead of leaving page
  useEffect(() => {
    const handlePopState = () => {
      if (showModal) {
        setSelectedNote(null);
        setShowModal(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showModal]);

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
      guitar: 'bg-amber-600',
      piano: 'bg-slate-700',
      violin: 'bg-amber-700',
      drums: 'bg-slate-800',
      vocal: 'bg-amber-500',
      bass: 'bg-slate-600',
      ukulele: 'bg-amber-800'
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading music notes...</p>
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-4">
            <div className="text-amber-600 text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchMusicNotes}
              className="bg-amber-600 text-slate-900 px-6 py-3 rounded-lg hover:bg-amber-500 transition duration-300 font-semibold"
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

      <div className="min-h-screen bg-slate-50 pt-20">
        <section className="relative overflow-hidden border-b border-amber-600/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(217,119,6,0.22),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(245,158,11,0.12),transparent_25%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-12 sm:pb-10">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-600/30 bg-amber-600/10 text-amber-300 text-sm font-medium mb-5">
                <Music className="w-4 h-4" /> Music Learning Library
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-3">Music Notes</h1>
              <p className="text-slate-300/90 text-base sm:text-lg max-w-2xl mx-auto">
                Discover and learn from our structured notes, tabs, and practical techniques.
              </p>
            </div>

            <div className="mx-auto max-w-3xl rounded-2xl border border-amber-600/25 bg-slate-900/55 backdrop-blur p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-600/30 bg-slate-950/50 text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-amber-600/30 bg-slate-950/50 text-slate-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-900 text-slate-100">
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No notes found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
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
                  className="bg-amber-600 text-slate-900 px-6 py-3 rounded-lg hover:bg-amber-500 transition duration-300 font-semibold"
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
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200 overflow-hidden hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
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
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {note.title}
                    </h3>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {note.explanation || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-500">
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
        <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <button
                  onClick={closeNoteModal}
                  className="flex items-center text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  <span className="hidden sm:inline">Back to Library</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => shareNote(selectedNote)}
                    className="flex items-center text-slate-600 hover:text-amber-700 transition-colors text-sm sm:text-base"
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
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
                    {selectedNote.title}
                  </h1>
                </div>
              </div>
              {selectedNote.explanation && (
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto px-2">
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