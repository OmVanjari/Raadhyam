import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Search, Mail, Phone, Calendar, BookOpen,
  TrendingUp, UserCheck, UserX, Clock, RefreshCw,
  AlertCircle, ArrowLeft, CheckCircle, Shield, User,
  GraduationCap, Target, Filter
} from 'lucide-react';

/* ── Student Detail ─────────────────────────────────────────────── */
const StudentDetailPanel = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/admin/users/${studentId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setStudent(r.data.user || r.data.data || r.data))
      .catch(() => setError('Failed to load student details.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-center py-16">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <p className="text-gray-600 mb-4 text-sm">{error}</p>
      <button onClick={onBack} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">← Back</button>
    </div>
  );

  if (!student) return null;

  const initials = (() => {
    const n = student.name || student.username || student.email || 'U';
    const parts = n.split(' ');
    return parts.length >= 2 ? (parts[0][0]+parts[1][0]).toUpperCase() : n.substring(0,2).toUpperCase();
  })();

  const isActive = student.status !== 'Deleted' && student.status !== 'Inactive';
  const progress        = student.progress        || 0;
  const enrolledCount   = student.enrolledCourses  || 0;
  const completedCount  = student.completedCourses || 0;
  const completedLessons = student.completedLessons || 0;
  const totalLessons    = student.totalLessons     || 0;

  return (
    <div className="space-y-5">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={15} /> Back to Students
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-800">{student.name || 'Student'}</span>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-16 bg-amber-500" />
        <div className="px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 -mt-8 mb-4">
            <div className="flex items-end gap-3">
              <div className="w-16 h-16 bg-white border-4 border-white rounded-xl shadow flex items-center justify-center bg-amber-100">
                <span className="text-amber-700 font-bold text-xl">{initials}</span>
              </div>
              <div className="mb-1">
                <h2 className="text-lg font-bold text-gray-900">{student.name || student.username || 'Student'}</h2>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {isActive ? <UserCheck size={12}/> : <UserX size={12}/>}
                {student.status || (isActive ? 'Active' : 'Inactive')}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Shield size={12}/> {student.role || 'Student'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Mail,     label:'Email',      value: student.email },
              { icon: Phone,    label:'Phone',      value: student.phone },
              { icon: Calendar, label:'Joined',     value: student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : null },
              { icon: Clock,    label:'Last Login', value: student.lastLogin ? new Date(student.lastLogin).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : null },
              { icon: User,     label:'Username',   value: student.username },
              { icon: Target,   label:'Country',    value: student.country },
            ].filter(row => row.value).map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <row.icon size={14} className="text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-400">{row.label}</div>
                  <div className="text-sm font-medium text-gray-800 truncate">{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats — only show if there's enrollment data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Enrolled',  value: enrolledCount,   show: true,                    color:'text-blue-600',  bg:'bg-blue-50' },
          { label:'Completed', value: completedCount,  show: true,                    color:'text-green-600', bg:'bg-green-50' },
          { label:'Progress',  value: `${progress}%`,  show: enrolledCount > 0,       color:'text-amber-600', bg:'bg-amber-50' },
          { label:'Rating',    value: student.rating,  show: !!student.rating,        color:'text-purple-600',bg:'bg-purple-50' },
        ].filter(s => s.show).map((s,i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-xs font-medium ${s.color} ${s.bg} inline-block px-2 py-0.5 rounded mb-2`}>{s.label}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar — only when enrolled */}
      {enrolledCount > 0 && (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-amber-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-amber-500 h-2 rounded-full transition-all duration-700" style={{ width:`${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{completedLessons} lessons completed</span>
          <span>{totalLessons} total</span>
        </div>
      </div>
      )}

      {/* Enrolled courses */}
      {student.coursesEnrolled?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2"><GraduationCap size={15} className="text-amber-500" /> Enrolled Courses</h4>
          </div>
          <div className="divide-y divide-gray-50">
            {student.coursesEnrolled.map((c, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {c.thumbnailUrl
                        ? <img src={c.thumbnailUrl} alt={c.title} className="w-9 h-9 object-cover rounded-lg" />
                        : <span className="text-sm">🎵</span>}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{c.title || `Course ${i+1}`}</div>
                      <div className="text-xs text-gray-400">{c.category} · {c.enrolledAt ? new Date(c.enrolledAt).toLocaleDateString() : ''}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md flex-shrink-0 ${c.completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.completed ? '✓ Done' : `${c.progress || 0}%`}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 ml-12">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width:`${c.progress || 0}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-12">{c.completedLessons || 0} / {c.totalLessons || 0} lessons</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Students List ──────────────────────────────────────────────── */
const StudentsPage = ({ initialStudentId, onStudentOpened }) => {
  const [students, setStudents]           = useState([]);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || null);

  // If navigated from dashboard with a pre-selected student
  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
      onStudentOpened?.();
    }
  }, [initialStudentId]);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true); setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = Array.isArray(res.data) ? res.data : (res.data.users || res.data.data || []);
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally { setLoading(false); }
  };

  const filtered = students.filter(s => {
    const name  = (s.name || s.username || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    const term  = searchTerm.toLowerCase();
    const matchSearch = name.includes(term) || email.includes(term);
    const isActive = s.status !== 'Deleted' && s.status !== 'Inactive';
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? isActive : !isActive);
    return matchSearch && matchStatus;
  });

  const stats = {
    total:    students.length,
    active:   students.filter(s => s.status !== 'Deleted' && s.status !== 'Inactive').length,
    inactive: students.filter(s => s.status === 'Deleted' || s.status === 'Inactive').length,
  };

  const getInitials = (s) => {
    const n = s.name || s.username || s.email || 'U';
    const p = n.split(' ');
    return p.length >= 2 ? (p[0][0]+p[1][0]).toUpperCase() : n.substring(0,2).toUpperCase();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-center py-16">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <p className="text-gray-600 mb-4 text-sm">{error}</p>
      <button onClick={fetchStudents} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">Try Again</button>
    </div>
  );

  if (selectedStudentId) {
    return <StudentDetailPanel studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={fetchStudents} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Total',    value: stats.total,    color:'text-blue-600',  bg:'bg-blue-50' },
          { label:'Active',   value: stats.active,   color:'text-green-600', bg:'bg-green-50' },
          { label:'Inactive', value: stats.inactive, color:'text-gray-600',  bg:'bg-gray-100' },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-xs font-medium ${s.color} ${s.bg} inline-block px-2 py-0.5 rounded mb-2`}>{s.label}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search by name or email..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Student cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
          <Users size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No students found</p>
          <p className="text-gray-400 text-sm mt-1">{searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No students enrolled yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(student => {
            const isActive = student.status !== 'Deleted' && student.status !== 'Inactive';
            return (
              <div key={student._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-200 hover:shadow-sm transition-all duration-150">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-base flex-shrink-0">
                      {getInitials(student)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{student.name || student.username || 'Student'}</div>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md mt-0.5 ${isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {isActive ? <UserCheck size={11}/> : <UserX size={11}/>}
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {student.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                    Joined {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold text-gray-900">{student.enrolledCourses || student.coursesEnrolled?.length || 0}</div>
                    <div className="text-xs text-gray-400">Enrolled</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <div className="text-lg font-bold text-gray-900">{student.completedCourses || 0}</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                </div>

                <button onClick={() => setSelectedStudentId(student._id)}
                  className="w-full py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
