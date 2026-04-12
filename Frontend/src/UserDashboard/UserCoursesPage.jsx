import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AMBER = '#D97706';
const SLATE = '#1E293B';
const MUTED = '#64748B';
const SANS  = "'Lato',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond',Georgia,serif";

const UserCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    // Use public courses endpoint which only shows published courses
    axios.get('/api/courses')
      .then(r => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  const fetchEnrolledCourses = () => {
    axios.get('/api/user/courses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => {
        if (r.data.success && r.data.data) {
          const enrolledIds = new Set(r.data.data.map(course => course.courseId));
          setEnrolledCourses(enrolledIds);
        }
      })
      .catch(() => {
        // If fetch fails, user might not be authenticated or has no enrollments
        setEnrolledCourses(new Set());
      });
  };

  const handleEnroll = async (courseId, courseTitle) => {
    setEnrollingId(courseId);
    
    try {
      const response = await axios.post('/api/user/enroll', 
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data.success) {
        setEnrolledCourses(prev => new Set([...prev, courseId]));
        setNotification({
          type: 'success',
          message: `Enrolled in "${courseTitle}"! Check My Courses tab.`
        });
      }
    } catch (error) {
      // Check if user is already enrolled (backend returns alreadyEnrolled: true)
      if (error.response?.data?.alreadyEnrolled) {
        setEnrolledCourses(prev => new Set([...prev, courseId]));
        setNotification({
          type: 'success',
          message: `You are already enrolled in "${courseTitle}"`
        });
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to enroll. Please try again.';
        setNotification({
          type: 'error',
          message: errorMessage
        });
      }
    } finally {
      setEnrollingId(null);
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '14px 20px',
          borderRadius: 10,
          background: notification.type === 'success' ? '#10B981' : '#EF4444',
          color: '#fff',
          fontFamily: SANS,
          fontSize: '0.9rem',
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out',
          maxWidth: 320
        }}>
          {notification.type === 'success' ? '✓ ' : '✕ '}{notification.message}
        </div>
      )}

      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>Explore Courses</h1>
        <p style={{ color:MUTED, fontSize:'0.9rem', fontFamily:SANS }}>Browse and enroll in available music courses</p>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search courses..."
        style={{ width:'100%', maxWidth:400, padding:'10px 16px', border:'1.5px solid #E2E8F0', borderRadius:12, fontSize:'0.9rem', fontFamily:SANS, color:SLATE, outline:'none', marginBottom:'1.5rem', background:'#fff' }}
        onFocus={e=>e.target.style.borderColor=AMBER} onBlur={e=>e.target.style.borderColor='#E2E8F0'} />

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', color:MUTED, fontFamily:SANS }}>No courses found.</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
          {filtered.map((c,i) => (
            <div key={i} style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #F1F5F9', boxShadow:'0 2px 12px rgba(30,41,59,0.05)', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(217,119,6,0.14)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(30,41,59,0.05)'; }}>
              {c.thumbnailUrl
                ? <img src={c.thumbnailUrl} alt={c.title} style={{ width:'100%', height:160, objectFit:'cover' }} />
                : <div style={{ width:'100%', height:160, background:`linear-gradient(135deg,${AMBER},#B45309)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🎵</div>
              }
              <div style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                  {c.level && <span style={{ fontSize:'0.7rem', fontWeight:700, color:AMBER, background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.level}</span>}
                  {c.category && <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#8B5CF6', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:'2px 10px', fontFamily:SANS }}>{c.category}</span>}
                </div>
                <h3 style={{ fontFamily:SERIF, fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:6 }}>{c.title}</h3>
                <p style={{ color:MUTED, fontSize:'0.82rem', lineHeight:1.6, fontFamily:SANS, marginBottom:'1rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.description}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'0.78rem', color:MUTED, fontFamily:SANS }}>🕐 {c.duration || 'Self-paced'}</span>
                  {enrolledCourses.has(c._id) ? (
                    <span style={{ 
                      background: '#10B981', 
                      color: '#fff', 
                      border:'none', 
                      borderRadius:8, 
                      padding:'7px 16px', 
                      fontSize:'0.78rem', 
                      fontWeight:700, 
                      fontFamily:SANS 
                    }}>✓ Enrolled</span>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(c._id, c.title);
                      }}
                      disabled={enrollingId === c._id}
                      style={{ 
                        background: enrollingId === c._id ? '#94A3B8' : `linear-gradient(135deg,${AMBER},#B45309)`,
                        color:'#fff', 
                        border:'none', 
                        borderRadius:8, 
                        padding:'7px 16px', 
                        fontSize:'0.78rem', 
                        fontWeight:700, 
                        cursor: enrollingId === c._id ? 'not-allowed' : 'pointer',
                        fontFamily:SANS 
                      }}
                    >
                      {enrollingId === c._id ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCoursesPage;
