import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Music, X, Share2, BookOpen, Clock } from 'lucide-react';

const UserNotesPage = () => {
  const [notes, setNotes]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);

  const categories = ['all','guitar','piano','violin','drums','vocal','bass','ukulele'];

  useEffect(() => {
    axios.get('/api/music-notes')
      .then(r => setNotes(r.data.data || r.data.notes || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let f = notes;
    if (search) f = f.filter(n =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.category?.toLowerCase().includes(search.toLowerCase()) ||
      n.explanation?.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'all') f = f.filter(n => n.category === category);
    setFiltered(f);
  }, [notes, search, category]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedNote ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedNote]);

  const getCategoryColor = (cat) => ({
    guitar:'bg-amber-600', piano:'bg-slate-700', violin:'bg-amber-700',
    drums:'bg-slate-800', vocal:'bg-amber-500', bass:'bg-slate-600', ukulele:'bg-amber-800'
  }[cat] || 'bg-gray-500');

  const getCategoryIcon = (cat) => ({
    guitar:'🎸', piano:'🎹', violin:'🎻', drums:'🥁',
    vocal:'🎤', bass:'🎸', ukulele:'🪕'
  }[cat] || '🎵');

  const shareNote = (note) => {
    const url = `${window.location.origin}/music-notes/${note._id}`;
    if (navigator.share) { navigator.share({ title: note.title, url }); }
    else { navigator.clipboard.writeText(url); alert('Link copied!'); }
  };

  /* ── same renderContent as public Notes page ── */
  const renderContent = (sections) => {
    if (!sections) sections = [];
    if (!Array.isArray(sections)) sections = [sections];
    if (sections.length === 0) return (
      <div className="text-center py-10 text-gray-500">
        <Music className="w-14 h-14 mx-auto mb-4 text-gray-300" />
        No content available
      </div>
    );
    return sections.map((section, index) => {
      const lyricsLines = section?.lyrics ? section.lyrics.split('\n').filter(l => l.trim()) : [];
      const tabLines    = section?.notation?.tabs ? section.notation.tabs.split('\n').filter(l => l.trim()) : [];
      const maxLines    = Math.max(lyricsLines.length, tabLines.length);
      return (
        <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-200">
          <div className="space-y-1">
            {Array.from({ length: maxLines }).map((_, i) => (
              <div key={i} className="leading-tight">
                {lyricsLines[i] && (
                  <div className="text-gray-900 text-xl font-medium leading-tight">{lyricsLines[i]}</div>
                )}
                {i === 0 && section?.notation?.string && (
                  <div className="mt-2 mb-3 text-sm">
                    Strings Pattern:
                    <span className="text-blue-800 px-3 py-1 font-medium">{section.notation.string}</span>
                  </div>
                )}
                {tabLines[i] && (
                  <div className="font-mono text-green-700 text-sm sm:text-base tracking-wide -mt-1">{tabLines[i]}</div>
                )}
              </div>
            ))}
          </div>
          {section?.notation?.playingTechniques?.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 items-center">
                <p className="font-semibold text-xs">Playing Techniques:</p>
                {section.notation.playingTechniques.map((tech, i) => (
                  <span key={i} className="bg-green-500 text-white px-3 py-1 rounded-md text-xs">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif" }}>Music Notes</h1>
        <p className="text-slate-500 text-sm mt-1">Click any note to open it</p>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 transition-colors" />
        </div>
        <select value={category} onChange={e=>setCategory(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 transition-colors bg-white">
          {categories.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase()+c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading notes...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">🎼</div>
          <p className="text-gray-500">{search || category !== 'all' ? 'No notes match your search.' : 'No notes available yet.'}</p>
          {(search || category !== 'all') && (
            <button onClick={()=>{setSearch('');setCategory('all');}} className="mt-4 text-sm font-bold text-amber-600 hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(note => (
            <div key={note._id} onClick={() => setSelectedNote(note)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200 overflow-hidden hover:-translate-y-1">
              <div className="h-44 bg-gradient-to-br from-slate-900 to-slate-700 relative overflow-hidden">
                {note.thumbnail
                  ? <img src={note.thumbnail} alt={note.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl text-white opacity-80">{getCategoryIcon(note.category)}</div>
                }
                <div className="absolute top-3 left-3">
                  <span className={`${getCategoryColor(note.category)} text-white px-3 py-1 rounded-full text-xs font-medium capitalize`}>{note.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">{note.title}</h3>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{note.explanation || 'No description available'}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{note.sections?.length || 0} sections</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-screen modal — same as public Notes page */}
      {selectedNote && (
        <div className="fixed inset-y-0 left-0 right-0 md:left-72 bg-slate-50 z-30 overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <button onClick={() => setSelectedNote(null)}
                  className="flex items-center text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base">
                  <X className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Back to Library</span>
                  <span className="sm:hidden">Back</span>
                </button>
                <button onClick={() => shareNote(selectedNote)}
                  className="flex items-center text-slate-600 hover:text-amber-700 transition-colors text-sm">
                  <Share2 className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {/* Note header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                {selectedNote.thumbnail && (
                  <img src={selectedNote.thumbnail} alt={selectedNote.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover mb-4 sm:mb-0 sm:mr-5" />
                )}
                <div className="flex-1">
                  <span className={`inline-block ${getCategoryColor(selectedNote.category)} text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize mb-2`}>
                    {selectedNote.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{selectedNote.title}</h1>
                </div>
              </div>
              {selectedNote.explanation && (
                <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">{selectedNote.explanation}</p>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-6 sm:space-y-8">
              {renderContent(selectedNote.sections)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotesPage;
