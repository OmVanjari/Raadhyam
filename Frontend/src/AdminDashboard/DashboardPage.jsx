import React from 'react';
import { BookOpen, Users, FileText, TrendingUp, Star, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

const DashboardPage = ({ dashboardStats, loading, onOpenStudent, onOpenCourse }) => {
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Courses"     value={dashboardStats.totalCourses     || 0} icon={BookOpen}   color="bg-blue-500" />
        <StatCard title="Published"         value={dashboardStats.publishedCourses || 0} icon={TrendingUp}  color="bg-green-500" />
        <StatCard title="Total Enrollments" value={dashboardStats.totalEnrollments || 0} icon={Users}       color="bg-amber-500" />
        <StatCard title="Music Notes"       value={dashboardStats.totalNotes       || 0} icon={FileText}    color="bg-purple-500" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Students"   value={dashboardStats.totalUsers      || 0} icon={Users}       color="bg-slate-500" />
        <StatCard title="Monthly Revenue"  value={`₹${dashboardStats.monthlyRevenue || 0}`} icon={DollarSign} color="bg-emerald-500" />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Enrollments — clickable */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Recent Enrollments</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {dashboardStats.recentEnrollments?.length > 0
              ? dashboardStats.recentEnrollments.slice(0,5).map((e, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  {/* User — clickable */}
                  <button
                    onClick={() => e.user?._id && onOpenStudent?.(e.user._id)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0">
                      {(e.user?.name || 'U')[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors">
                        {e.user?.name || 'Unknown'}
                      </div>
                      {/* Course — clickable */}
                      <button
                        onClick={ev => { ev.stopPropagation(); e.course?._id && onOpenCourse?.(e.course._id); }}
                        className="text-xs text-gray-400 hover:text-amber-500 transition-colors text-left"
                      >
                        {e.course?.title || 'Unknown Course'}
                      </button>
                    </div>
                  </button>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('en-IN', { month:'short', day:'numeric' }) : '—'}
                  </span>
                </div>
              ))
              : <div className="px-5 py-8 text-center text-sm text-gray-400">No recent enrollments</div>
            }
          </div>
        </div>

        {/* Popular Courses — clickable */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Popular Courses</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {dashboardStats.popularCourses?.length > 0
              ? dashboardStats.popularCourses.slice(0,5).map((c, i) => (
                <button
                  key={i}
                  onClick={() => c._id && onOpenCourse?.(c._id)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5">#{i+1}</span>
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {c.thumbnailUrl
                        ? <img src={c.thumbnailUrl} alt={c.title} className="w-9 h-9 object-cover rounded-lg" />
                        : <BookOpen size={15} className="text-amber-600" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors truncate max-w-[160px]">{c.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{c.stats?.enrolledStudents || 0} students</span>
                        <span className="text-xs text-amber-500 flex items-center gap-0.5">
                          <Star size={10} className="fill-current" />{c.stats?.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width:`${Math.min(100,(c.stats?.enrolledStudents||0)*10)}%` }} />
                  </div>
                </button>
              ))
              : <div className="px-5 py-8 text-center text-sm text-gray-400">No courses yet</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
