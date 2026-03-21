import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  Users, 
  Clock, 
  Eye, 
  Edit3,
  PlayCircle,
  FileText,
  BarChart3,
  CheckCircle,
  Settings
} from 'lucide-react';
import ModuleList from './ModuleList';

const CourseDetailPage = ({ 
  course, 
  onBack, 
  onSaveContent, 
  onOpenModuleForm, 
  onOpenLessonForm 
}) => {
  const [courseData, setCourseData] = useState(course);

  // Calculate course statistics
  const calculateStats = () => {
    const totalModules = courseData.modules?.length || 0;
    const totalLessons = courseData.modules?.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0) || 0;
    
    let totalDuration = 0;
    courseData.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        if (lesson.duration) {
          const [minutes, seconds] = lesson.duration.split(':').map(Number);
          totalDuration += (minutes * 60) + (seconds || 0);
        }
      });
    });
    
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    return {
      totalModules,
      totalLessons,
      totalDuration: `${hours}h ${minutes}m`,
      totalDurationSeconds: totalDuration
    };
  };

  const stats = calculateStats();

  // Module and Lesson handlers
  const handleAddModule = () => {
    onOpenModuleForm();
  };

  const handleEditModule = (module, index) => {
    onOpenModuleForm({ ...module, index });
  };

  const handleDeleteModule = async (index) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons will be deleted.')) {
      const updatedModules = courseData.modules.filter((_, i) => i !== index);
      await onSaveContent(updatedModules);
      setCourseData(prev => ({ ...prev, modules: updatedModules }));
    }
  };

  const handleAddLesson = (moduleIndex) => {
    onOpenLessonForm({ moduleIndex });
  };

  const handleEditLesson = (lesson, moduleIndex, lessonIndex) => {
    onOpenLessonForm({ ...lesson, moduleIndex, lessonIndex });
  };

  const handleDeleteLesson = async (moduleIndex, lessonIndex) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedModules = [...courseData.modules];
      updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      await onSaveContent(updatedModules);
      setCourseData(prev => ({ ...prev, modules: updatedModules }));
    }
  };

  const handleSaveModules = async (updatedModules) => {
    await onSaveContent(updatedModules);
    setCourseData(prev => ({ ...prev, modules: updatedModules }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
            <p className="text-gray-600">{courseData.subtitle}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Eye size={16} className="mr-2" />
            Preview
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Edit3 size={16} className="mr-2" />
            Edit Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Course Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Course Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                {courseData.thumbnailUrl ? (
                  <img 
                    src={courseData.thumbnailUrl} 
                    alt={courseData.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <BookOpen size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{courseData.title}</h3>
                <p className="text-sm text-gray-600">{courseData.category}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  courseData.publish?.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : courseData.publish?.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {courseData.publish?.status || 'draft'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Modules</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalModules}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lessons</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalLessons}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalDuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students</span>
                <span className="text-sm font-medium text-gray-900 flex items-center">
                  <Users size={14} className="mr-1" />
                  {courseData.stats?.enrolledStudents || 0}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-lg font-bold text-gray-900">
                  {courseData.isFree ? 'FREE' : `₹${courseData.price}`}
                </span>
              </div>
              {courseData.offerPrice && !courseData.isFree && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Offer Price</span>
                  <span className="text-green-600 font-medium">₹{courseData.offerPrice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Instructor</h4>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                {courseData.instructor?.profileImage ? (
                  <img 
                    src={courseData.instructor.profileImage} 
                    alt={courseData.instructor.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <Users size={16} className="text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{courseData.instructor?.name}</p>
                <p className="text-xs text-gray-600">Instructor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Course Builder */}
        <div className="lg:col-span-3">
          <ModuleList
            modules={courseData.modules || []}
            onAddModule={handleAddModule}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
            onSaveModules={handleSaveModules}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;