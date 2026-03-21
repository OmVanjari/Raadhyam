import React from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  TrendingUp,
  Calendar,
  BarChart3 
} from 'lucide-react';

const StatCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-1 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={14} className={change > 0 ? '' : 'rotate-180'} />
            <span className="ml-1">{Math.abs(change)}% from last month</span>
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        {React.cloneElement(icon, { 
          size: 24, 
          className: color.replace('text-', 'text-') 
        })}
      </div>
    </div>
  </div>
);

const DashboardPage = ({ dashboardStats, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={dashboardStats.totalCourses || 0}
          icon={<BookOpen />}
          color="text-blue-600"
          change={12}
        />
        <StatCard
          title="Published Courses"
          value={dashboardStats.publishedCourses || 0}
          icon={<BookOpen />}
          color="text-green-600"
          change={8}
        />
        <StatCard
          title="Total Enrollments"
          value={dashboardStats.totalEnrollments || 0}
          icon={<Users />}
          color="text-orange-600"
          change={15}
        />
        <StatCard
          title="Music Notes"
          value={dashboardStats.totalNotes || 0}
          icon={<FileText />}
          color="text-purple-600"
          change={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users size={20} className="mr-2" />
              Recent Enrollments
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardStats.recentEnrollments?.slice(0, 5).map((enrollment) => (
                <div key={enrollment._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{enrollment.user?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{enrollment.course?.title || 'Unknown Course'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp size={20} className="mr-2" />
              Popular Courses
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardStats.popularCourses?.slice(0, 5).map((course, index) => (
                <div key={course._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{course.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {course.stats?.enrolledStudents || 0} students
                        </span>
                        <span className="flex items-center">
                          <BarChart3 size={14} className="mr-1" />
                          {course.stats?.rating?.toFixed(1) || '0.0'} rating
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (course.stats?.enrolledStudents || 0) / 10)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;