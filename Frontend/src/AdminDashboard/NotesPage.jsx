import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Calendar, Edit3, Trash2, RefreshCw, AlertCircle, Music } from 'lucide-react';
import axios from 'axios';

const NotesPage = ({ openNoteForm, editMusicNote }) => {
  const [notes, setNotes]       = useState([]);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const cfg = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: token ? `Bearer ${token}` : '' } };
  };

  const fetchNotes = async () => {
    try {
      setLoading(true); setError(null);
      const res = await axios.get('/api/admin/music-notes', cfg());
      setNotes(res.data.data || []);
    } catch { setError('Failed to load notes.'); }
    finally { setLoading(false); }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/api/admin/music-notes/${id}`, cfg());
      setNotes(p => p.filter(n => n._id !== id));
    } catch { alert('Failed to delete note.'); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const categories = [...new Set(notes.map(n => n.category).filter(Boolean))];

  const filtered = notes.filter(n => {
    const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
                        n.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || n.category === category;
    return matchSearch && matchCat;
  });

  const catColor = (cat) => ({
    guitar:'bg-blue-100 text-blue-700', piano:'bg-green-100 text-green-700',
    violin:'bg-purple-100 text-purple-700', drums:'bg-orange-100 text-orange-700',
    vocal:'bg-pink-100 text-pink-700', bass:'bg-amber-100 text-amber-700',
    ukulele:'bg-yellow-100 text-yellow-700',
  }[cat?.toLowerCase()] || 'bg-gray-100 text-gray-600');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Music Notes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} note{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchNotes} disabled={loading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openNoteForm}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors">
            <Plus size={15} /> New Note
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle size={16} /> {error}
          <button onClick={fetchNotes} className="ml-auto text-red-600 font-semibold hover:underline">Retry</button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search notes..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-3 text-gray-500 text-sm">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          Loading notes...
        </div>
      )}

      {/* Grid */}
      {!loading && (
        filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
            <Music size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No notes found</p>
            <p className="text-gray-400 text-sm mt-1">{search || category !== 'all' ? 'Try adjusting your filters' : 'Create your first music note'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(note => (
              <div key={note._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-amber-200 hover:shadow-sm transition-all duration-150">
                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-700 relative overflow-hidden">
                  {note.thumbnail
                    ? <img src={note.thumbnail} alt={note.title} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'} />
                    : <div className="w-full h-full flex items-center justify-center"><FileText size={40} className="text-white opacity-30" /></div>
                  }
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${catColor(note.category)}`}>
                      {note.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{note.title}</h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {note.explanation || note.sections?.[0]?.lyrics?.substring(0,80) || 'No description'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText size={11} /> {note.sections?.length || 0} sections
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {new Date(note.createdAt).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => editMusicNote(note)} title="Edit"
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => deleteNote(note._id)} title="Delete"
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default NotesPage;
