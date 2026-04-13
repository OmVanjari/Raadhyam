import React, { useEffect, useState } from 'react';
import { BookOpen, Users, FileText, Star, DollarSign, GraduationCap, CheckCircle } from 'lucide-react';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const fmtDate = () =>
  new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

const StatCard = ({ title, value, icon: Icon, iconBg, delay = 0 }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
    style={{ animation:'fadeInUp 0.35s ease both', animationDelay:`${delay}ms` }}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={17} className="text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900 tabular-nums">{value}</div>
  </div>
);

const Section = ({ children, delay = 0, className = '' }) => (
  <div className={className} style={{ animation:'fadeInUp 0.4s ease both', animationDelay:`${delay}ms` }}>
    {children}
  </div>
);

const Avatar = ({ name = '' }) => (
  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
    {(name || 'U')[0].toUpperCase()}
  </div>
);

const DashboardPage = ({ dashboardStats = {}, loading, onOpenStudent, onOpenCourse }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!visible) return null;

  const {
    totalCourses = 0, publishedCourses = 0, totalEnrollments = 0,
    totalNotes = 0, totalUsers = 0, monthlyRevenue = 0,
    recentEnrollments = [], popularCourses = [],
  } = dashboardStats;

  return (
    <div className="space-y-6">

      {/* Header */}
      <Section delay={0}>
        <h1 className="text-xl font-bold text-gray-900">{greeting()}, Admin 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">{fmtDate()}</p>
      </Section>

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Courses"  value={totalCourses}     icon={BookOpen}      iconBg="bg-blue-500"    delay={0}   />
        <StatCard title="Published"      value={publishedCourses} icon={CheckCircle}   iconBg="bg-green-500"   delay={80}  />
        <StatCard title="Enrollments"    value={totalEnrollments} icon={GraduationCap} iconBg="bg-amber-500"   delay={160} />
        <StatCard title="Music Notes"    value={totalNotes}       icon={FileText}      iconBg="bg-purple-500"  delay={240} />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Students"  value={totalUsers}           icon={Users}      iconBg="bg-slate-500"   delay={300} />
        <StatCard title="Monthly Revenue" value={`₹${monthlyRevenue}`} icon={DollarSign} iconBg="bg-emerald-500" delay={360} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Enrollments */}
        <Section delay={420}>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">Recent Enrollments</h3>
              <span className="text-xs text-gray-400">{recentEnrollments.length} total</span>
            </div>
            <div className="divide-y divide-gray-50">
              {recentEnrollments.length > 0
                ? recentEnrollments.slice(0,5).map((e, i) => (
                  <div key={i}
                    className="flex items-center justify-between px-5 py-3 hover:bg-amber-50/40 transition-colors duration-100 cursor-pointer"
                    onClick={() => e.user?._id && onOpenStudent?.(e.user._id)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={e.user?.name} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 hover:text-amber-600 transition-colors truncate">
                          {e.user?.name || 'Unknown'}
                        </div>
                        <button
                          onClick={ev => { ev.stopPropagation(); e.course?._id && onOpenCourse?.(e.course._id); }}
                          className="text-xs text-gray-400 hover:text-amber-500 transition-colors text-left truncate max-w-[180px] block">
                          {e.course?.title || 'Unknown Course'}
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('en-IN',{month:'short',day:'numeric'}) : '—'}
                    </span>
                  </div>
                ))
                : (
                  <div className="px-5 py-10 text-center">
                    <GraduationCap size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No recent enrollments</p>
                  </div>
                )
              }
            </div>
          </div>
        </Section>

        {/* Popular Courses */}
        <Section delay={480}>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">Popular Courses</h3>
              <span className="text-xs text-gray-400">{popularCourses.length} courses</span>
            </div>
            <div className="divide-y divide-gray-50">
              {popularCourses.length > 0
                ? popularCourses.slice(0,5).map((c, i) => (
                  <button key={i}
                    onClick={() => c._id && onOpenCourse?.(c._id)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-amber-50/40 transition-colors duration-100 text-left group">
                    <span className="text-xs font-bold text-gray-300 w-4 flex-shrink-0">#{i+1}</span>
                    <div className="w-9 h-9 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {c.thumbnailUrl
                        ? <img src={c.thumbnailUrl} alt={c.title} className="w-9 h-9 object-cover" />
                        : <BookOpen size={15} className="text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors truncate">{c.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{c.stats?.enrolledStudents || 0} students</span>
                        <span className="text-xs text-amber-500 flex items-center gap-0.5">
                          <Star size={10} className="fill-current" />{c.stats?.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1">
                        <div className="bg-amber-400 h-1 rounded-full transition-all duration-500"
                          style={{ width:`${Math.min(100,(c.stats?.enrolledStudents||0)*10)}%` }} />
                      </div>
                    </div>
                  </button>
                ))
                : (
                  <div className="px-5 py-10 text-center">
                    <BookOpen size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No courses yet</p>
                  </div>
                )
              }
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
};

export default DashboardPage;
