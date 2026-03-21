import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Tag, 
  Image, 
  DollarSign, 
  Clock, 
  Target, 
  User, 
  Settings, 
  Eye,
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Video,
  File,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  PlayCircle,
  List,
  Grid,
  EyeOff,
  CheckCircle,
  Edit3,
  Move,
  FileText,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Users,
  Globe as GlobeIcon,
  Lock,
  Link
} from 'lucide-react';

const CourseFormModal = ({ 
  editingCourse, 
  setShowCourseForm, 
  onCourseCreated,
  refreshCourses 
}) => {
  const [courseForm, setCourseForm] = useState(editingCourse || getInitialCourseForm());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [error, setError] = useState(null);

  const getAxiosConfig = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    };
  };

  const createCourse = async (courseData) => {
    try {
      console.log('📤 Creating course:', courseData);
      const response = await axios.post('/api/admin/courses', courseData, getAxiosConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error creating course:', err);
      throw new Error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const updateCourse = async (courseId, courseData) => {
    try {
      console.log('📤 Updating course:', courseId, courseData);
      const response = await axios.put(`/api/admin/courses/${courseId}`, courseData, getAxiosConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error updating course:', err);
      throw new Error(err.response?.data?.message || 'Failed to update course');
    }
  };

  const handleFileUpload = async (file, type = 'image') => {
    if (!file) return null;
    
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000,
      });

      return response.data.url;
      
    } catch (err) {
      console.error('❌ Upload error:', err);
      let errorMessage = 'Upload failed: ';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage += 'Cannot connect to server.';
      } else if (err.response?.status === 413) {
        errorMessage += 'File too large.';
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const validateCourseData = async (courseData) => {
    try {
      const response = await axios.post('/api/admin/courses/validate', courseData, getAxiosConfig());
      return response.data;
    } catch (err) {
      console.error('Error validating course:', err);
      if (err.response?.status === 404 || err.response?.status === 401) {
        console.log('Validation endpoint not available, skipping validation');
        return { valid: true };
      }
      throw new Error(err.response?.data?.message || 'Course validation failed');
    }
  };

  const generateSlug = async (title) => {
    try {
      const response = await axios.post('/api/admin/courses/generate-slug', 
        { title }, 
        getAxiosConfig()
      );
      return response.data.slug;
    } catch (err) {
      console.error('Error generating slug:', err);
      if (err.response?.status === 404 || err.response?.status === 401) {
        console.log('Slug generation endpoint not available, using local fallback');
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      throw new Error('Failed to generate slug');
    }
  };

  const updateByPath = (state, path, value) => {
    const keys = path.split('.');
    const newState = { ...state };
    let current = newState;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = { ...current[key] };
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return newState;
  };

  const handleCourseInputChange = (path, value) => {
    setCourseForm(prev => updateByPath(prev, path, value));
  };

  const handleArrayFieldChange = (path, index, value) => {
    setCourseForm(prev => {
      const newState = { ...prev };
      const keys = path.split('.');
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      const arrayKey = keys[keys.length - 1];
      current[arrayKey] = [...current[arrayKey]];
      current[arrayKey][index] = value;
      
      return newState;
    });
  };

  const addArrayField = (path) => {
    setCourseForm(prev => {
      const newState = { ...prev };
      const keys = path.split('.');
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      const arrayKey = keys[keys.length - 1];
      current[arrayKey] = [...current[arrayKey], ''];
      
      return newState;
    });
  };

  const removeArrayField = (path, index) => {
    setCourseForm(prev => {
      const newState = { ...prev };
      const keys = path.split('.');
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      const arrayKey = keys[keys.length - 1];
      if (current[arrayKey].length > 1) {
        current[arrayKey] = current[arrayKey].filter((_, i) => i !== index);
      }
      
      return newState;
    });
  };

  const handleFileChange = async (path, file) => {
    if (!file) return;
    
    try {
      setUploading(true);
      setError(null);
      
      let fileType = 'image';
      if (path.includes('video')) fileType = 'video';
      if (path.includes('pdf')) fileType = 'pdf';
      if (path.includes('audio')) fileType = 'audio';
      
      console.log(`🔄 Uploading ${fileType} file:`, file.name);
      
      const fileUrl = await handleFileUpload(file, fileType);
      
      if (fileUrl) {
        setCourseForm(prev => updateByPath(prev, path, fileUrl));
        console.log(`✅ File uploaded successfully: ${fileUrl}`);
      }
    } catch (error) {
      console.error('❌ File upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const addModule = () => {
    setEditingModule(null);
    setShowModuleForm(true);
  };

  const editModule = (module, index) => {
    setEditingModule({ ...module, index });
    setShowModuleForm(true);
  };

  const deleteModule = (index) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons in this module will also be deleted.')) {
      setCourseForm(prev => ({
        ...prev,
        modules: prev.modules.filter((_, i) => i !== index)
      }));
    }
  };

  const saveModule = (moduleData) => {
    console.log('💾 Saving module:', moduleData);
    
    if (editingModule?.index !== undefined) {
      setCourseForm(prev => {
        const newModules = [...prev.modules];
        newModules[editingModule.index] = {
          ...newModules[editingModule.index],
          ...moduleData,
          updatedAt: new Date().toISOString()
        };
        return { ...prev, modules: newModules };
      });
    } else {
      setCourseForm(prev => ({
        ...prev,
        modules: [...prev.modules, {
          ...moduleData,
          position: prev.modules.length,
          lessons: [],
          createdAt: new Date().toISOString()
        }]
      }));
    }
    setShowModuleForm(false);
    setEditingModule(null);
  };

  const addLesson = (moduleIndex) => {
    setEditingLesson(null);
    setEditingModule(courseForm.modules[moduleIndex]);
    setShowLessonForm(true);
  };

  const editLesson = (lesson, moduleIndex, lessonIndex) => {
    setEditingLesson({ ...lesson, moduleIndex, lessonIndex });
    setEditingModule(courseForm.modules[moduleIndex]);
    setShowLessonForm(true);
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setCourseForm(prev => {
        const newModules = [...prev.modules];
        newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
        return { ...prev, modules: newModules };
      });
    }
  };

  const saveLesson = (lessonData) => {
    console.log('💾 Saving lesson:', lessonData);
    
    setCourseForm(prev => {
      const newModules = prev.modules.map((module, modIndex) => {
        if (editingLesson ? modIndex === editingLesson.moduleIndex : modIndex === editingModule.index) {
          if (editingLesson?.lessonIndex !== undefined) {
            return {
              ...module,
              lessons: module.lessons.map((lesson, lesIndex) =>
                lesIndex === editingLesson.lessonIndex 
                  ? { 
                      ...lesson, 
                      ...lessonData,
                      updatedAt: new Date().toISOString()
                    }
                  : lesson
              )
            };
          } else {
            return {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  ...lessonData,
                  position: module.lessons.length,
                  createdAt: new Date().toISOString()
                }
              ]
            };
          }
        }
        return module;
      });

      return { ...prev, modules: newModules };
    });

    setShowLessonForm(false);
    setEditingLesson(null);
    setEditingModule(null);
  };

  const moveLesson = (moduleIndex, lessonIndex, direction) => {
    setCourseForm(prev => {
      const newModules = [...prev.modules];
      const lessons = [...newModules[moduleIndex].lessons];
      const newIndex = lessonIndex + direction;
      
      if (newIndex >= 0 && newIndex < lessons.length) {
        [lessons[lessonIndex], lessons[newIndex]] = [lessons[newIndex], lessons[lessonIndex]];
        lessons.forEach((lesson, idx) => {
          lesson.position = idx;
        });
        newModules[moduleIndex].lessons = lessons;
        return { ...prev, modules: newModules };
      }
      return prev;
    });
  };

  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    courseForm.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (lesson.duration) {
          const [minutes, seconds] = lesson.duration.split(':').map(Number);
          totalSeconds += (minutes * 60) + (seconds || 0);
        }
      });
    });
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds, totalSeconds };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (!courseForm.title.trim()) {
        throw new Error('Course title is required');
      }
      if (!courseForm.category.trim()) {
        throw new Error('Course category is required');
      }

      const duration = calculateTotalDuration();
      
      const courseData = {
        ...courseForm,
        price: parseFloat(courseForm.price) || 0,
        totalDurationSeconds: duration.totalSeconds,
        duration: `${duration.hours}h ${duration.minutes}m`,
        tags: courseForm.tags.filter(tag => tag.trim() !== ''),
        prerequisites: courseForm.prerequisites.filter(item => item.trim() !== ''),
        whatYouWillLearn: courseForm.whatYouWillLearn.filter(item => item.trim() !== ''),
        requirements: courseForm.requirements.filter(item => item.trim() !== ''),
        seo: {
          ...courseForm.seo,
          keywords: courseForm.seo.keywords.filter(keyword => keyword.trim() !== '')
        },
        stats: {
          ...courseForm.stats,
          totalLessons: courseForm.modules.reduce((total, module) => total + module.lessons.length, 0)
        }
      };

      console.log('📦 Final course data:', courseData);

      try {
        await validateCourseData(courseData);
      } catch (validationError) {
        console.warn('Validation skipped:', validationError.message);
      }

      let result;
      if (editingCourse) {
        result = await updateCourse(editingCourse._id, courseData);
        alert('Course updated successfully!');
      } else {
        result = await createCourse(courseData);
        alert('Course created successfully!');
        
        if (onCourseCreated && result) {
          onCourseCreated(result);
        }
      }
      
      if (refreshCourses) {
        refreshCourses();
      }
      
      setShowCourseForm(false);
    } catch (error) {
      console.error('❌ Error saving course:', error);
      setError(error.message || 'Error saving course');
      alert(error.message || 'Error saving course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!editingCourse && courseForm.title) {
      const autoSave = setTimeout(async () => {
        try {
          const draftData = {
            ...courseForm,
            title: courseForm.title,
            status: 'draft'
          };
          console.log('Auto-saving draft...', draftData);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 60000);

      return () => clearTimeout(autoSave);
    }
  }, [courseForm, editingCourse]);

  const FileInput = ({ label, accept, value, onChange, previewUrl, className = '' }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-4">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                onChange(file);
              }
            }}
            disabled={uploading}
          />
          <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
          }`}>
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : value ? 'Change file' : 'Click to upload file'}
            </p>
            {uploading && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </label>
        {previewUrl && (
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <FileText size={24} className="text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'content', label: 'Course Content', icon: List },
    { id: 'instructor', label: 'Instructor', icon: User },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'seo', label: 'SEO', icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle size={20} className="text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen size={20} className="mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.title}
                    onChange={(e) => handleCourseInputChange('title', e.target.value)}
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.subtitle}
                    onChange={(e) => handleCourseInputChange('subtitle', e.target.value)}
                    placeholder="Brief course description"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.shortDescription}
                    onChange={(e) => handleCourseInputChange('shortDescription', e.target.value)}
                    placeholder="Brief overview of the course"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.description}
                    onChange={(e) => handleCourseInputChange('description', e.target.value)}
                    placeholder="Detailed course description"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag size={20} className="mr-2" />
                Categorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.category}
                    onChange={(e) => handleCourseInputChange('category', e.target.value)}
                    placeholder="e.g., Music Theory, Guitar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.level}
                    onChange={(e) => handleCourseInputChange('level', e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.language}
                    onChange={(e) => handleCourseInputChange('language', e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Separate tags with commas"
                    value={courseForm.tags.join(', ')}
                    onChange={(e) => handleCourseInputChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target size={20} className="mr-2" />
                Prerequisites
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What students should know before taking this course
                </label>
                {courseForm.prerequisites.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Prerequisite ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayFieldChange('prerequisites', index, e.target.value)}
                    />
                    {courseForm.prerequisites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('prerequisites', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('prerequisites')}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Prerequisite
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target size={20} className="mr-2" />
                Learning Objectives
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">What You Will Learn</label>
                {courseForm.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Learning objective ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayFieldChange('whatYouWillLearn', index, e.target.value)}
                    />
                    {courseForm.whatYouWillLearn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('whatYouWillLearn', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('whatYouWillLearn')}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Learning Objective
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                {courseForm.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Requirement ${index + 1}`}
                      value={item}
                      onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                    />
                    {courseForm.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('requirements', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('requirements')}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Requirement
                </button>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <List size={20} className="mr-2" />
                    Course Content
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {courseForm.modules.length} modules • {courseForm.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons • {calculateTotalDuration().hours}h {calculateTotalDuration().minutes}m total
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addModule}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Module
                </button>
              </div>

              {courseForm.modules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <List size={48} className="mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h4>
                  <p className="text-gray-600 mb-4">Start by creating your first module</p>
                  <button
                    type="button"
                    onClick={addModule}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                  >
                    <Plus size={16} className="mr-2" />
                    Create First Module
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courseForm.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                            <List size={20} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-600">
                              {module.lessons.length} lessons • {module.description || 'No description'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => addLesson(moduleIndex)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="Add Lesson"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => editModule(module, moduleIndex)}
                            className="text-gray-600 hover:text-gray-800 p-2"
                            title="Edit Module"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteModule(moduleIndex)}
                            className="text-red-600 hover:text-red-800 p-2"
                            title="Delete Module"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {module.lessons.length > 0 && (
                        <div className="bg-white divide-y divide-gray-100">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => moveLesson(moduleIndex, lessonIndex, -1)}
                                    disabled={lessonIndex === 0}
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                  >
                                    <Move size={16} className="rotate-90" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveLesson(moduleIndex, lessonIndex, 1)}
                                    disabled={lessonIndex === module.lessons.length - 1}
                                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                  >
                                    <Move size={16} className="-rotate-90" />
                                  </button>
                                </div>
                                <div className={`p-2 rounded-lg ${
                                  lesson.type === 'video' ? 'bg-red-100 text-red-600' :
                                  lesson.type === 'pdf' ? 'bg-orange-100 text-orange-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  {lesson.type === 'video' ? <PlayCircle size={16} /> :
                                   lesson.type === 'pdf' ? <FileText size={16} /> :
                                   <FileText size={16} />}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                  <p className="text-sm text-gray-600">
                                    {lesson.type} • {lesson.duration || 'No duration'}
                                    {lesson.isFreePreview && (
                                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        Free Preview
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => editLesson(lesson, moduleIndex, lessonIndex)}
                                  className="text-gray-600 hover:text-gray-800 p-2"
                                  title="Edit Lesson"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                  className="text-red-600 hover:text-red-800 p-2"
                                  title="Delete Lesson"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Instructor Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.name}
                    onChange={(e) => handleCourseInputChange('instructor.name', e.target.value)}
                    placeholder="Enter instructor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.email}
                    onChange={(e) => handleCourseInputChange('instructor.email', e.target.value)}
                    placeholder="instructor@example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.bio}
                    onChange={(e) => handleCourseInputChange('instructor.bio', e.target.value)}
                    placeholder="Instructor biography and credentials"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GlobeIcon size={20} className="mr-2" />
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Youtube size={16} className="mr-2 text-red-600" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.socialLinks.youtube}
                    onChange={(e) => handleCourseInputChange('instructor.socialLinks.youtube', e.target.value)}
                    placeholder="YouTube channel URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Instagram size={16} className="mr-2 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.socialLinks.instagram}
                    onChange={(e) => handleCourseInputChange('instructor.socialLinks.instagram', e.target.value)}
                    placeholder="Instagram profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Facebook size={16} className="mr-2 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.socialLinks.facebook}
                    onChange={(e) => handleCourseInputChange('instructor.socialLinks.facebook', e.target.value)}
                    placeholder="Facebook profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe size={16} className="mr-2 text-gray-600" />
                    Website
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.instructor.socialLinks.website}
                    onChange={(e) => handleCourseInputChange('instructor.socialLinks.website', e.target.value)}
                    placeholder="Personal website URL"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image size={20} className="mr-2" />
                Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileInput
                  label="Course Thumbnail"
                  accept="image/*"
                  value={courseForm.thumbnailUrl}
                  onChange={(file) => handleFileChange('thumbnailUrl', file)}
                  previewUrl={courseForm.thumbnailUrl}
                />
                <FileInput
                  label="Promo Video"
                  accept="video/*"
                  value={courseForm.promoVideoUrl}
                  onChange={(file) => handleFileChange('promoVideoUrl', file)}
                  previewUrl={courseForm.promoVideoUrl}
                />
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign size={20} className="mr-2" />
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.price}
                    onChange={(e) => handleCourseInputChange('price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price (INR)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.offerPrice}
                    onChange={(e) => handleCourseInputChange('offerPrice', parseFloat(e.target.value) || '')}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFree"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={courseForm.isFree}
                    onChange={(e) => handleCourseInputChange('isFree', e.target.checked)}
                  />
                  <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                    Free Course
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye size={20} className="mr-2" />
                Publish Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.publish.status}
                    onChange={(e) => handleCourseInputChange('publish.status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.visibility}
                    onChange={(e) => handleCourseInputChange('visibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {courseForm.publish.status === 'draft' && 'Course is in draft mode and not visible to students.'}
                  {courseForm.publish.status === 'published' && 'Course is published and visible to students.'}
                  {courseForm.publish.status === 'archived' && 'Course is archived and not accessible.'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {courseForm.visibility === 'public' && 'Course is publicly visible to all.'}
                  {courseForm.visibility === 'private' && 'Course is private and only accessible to enrolled students.'}
                  {courseForm.visibility === 'unlisted' && 'Course is unlisted and accessible via direct link only.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                Course Settings
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.currency}
                    onChange={(e) => handleCourseInputChange('currency', e.target.value)}
                  >
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 size={20} className="mr-2" />
                SEO Settings
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.seo.metaTitle}
                    onChange={(e) => handleCourseInputChange('seo.metaTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={courseForm.seo.metaDescription}
                    onChange={(e) => handleCourseInputChange('seo.metaDescription', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Separate keywords with commas"
                    value={courseForm.seo.keywords.join(', ')}
                    onChange={(e) => handleCourseInputChange('seo.keywords', e.target.value.split(',').map(keyword => keyword.trim()))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {courseForm.modules.length} modules • {courseForm.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
              </p>
            </div>
            <button 
              onClick={() => setShowCourseForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {renderTabContent()}

            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
              <div className="text-sm text-gray-600">
                {courseForm.publish.status === 'draft' ? (
                  <span className="flex items-center">
                    <EyeOff size={16} className="mr-1" />
                    Draft
                  </span>
                ) : (
                  <span className="flex items-center text-green-600">
                    <Eye size={16} className="mr-1" />
                    Published
                  </span>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCourseForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      {editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      {editingCourse ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showModuleForm && (
        <ModuleFormModal
          module={editingModule}
          onSave={saveModule}
          onClose={() => {
            setShowModuleForm(false);
            setEditingModule(null);
          }}
        />
      )}

      {showLessonForm && (
        <LessonFormModal
          lesson={editingLesson}
          onSave={saveLesson}
          onClose={() => {
            setShowLessonForm(false);
            setEditingLesson(null);
            setEditingModule(null);
          }}
          uploadFile={handleFileUpload}
        />
      )}
    </>
  );
};

const ModuleFormModal = ({ module, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 0
  });

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title || '',
        description: module.description || '',
        position: module.position || 0
      });
    }
  }, [module]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Module title is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {module ? 'Edit Module' : 'Add New Module'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Title *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Music Theory"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn in this module..."
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {module ? 'Update Module' : 'Add Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LessonFormModal = ({ lesson, onSave, onClose, uploadFile }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    videoUrl: '',
    pdfUrl: '',
    content: '',
    thumbnailUrl: '',
    duration: '',
    isFreePreview: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        type: lesson.type || 'video',
        videoUrl: lesson.videoUrl || '',
        pdfUrl: lesson.pdfUrl || '',
        content: lesson.content || '',
        thumbnailUrl: lesson.thumbnailUrl || '',
        duration: lesson.duration || '',
        isFreePreview: lesson.isFreePreview || false
      });
    }
  }, [lesson]);

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    try {
      setUploading(true);
      console.log(`📤 Uploading ${type} file:`, file.name);
      
      const fileUrl = await uploadFile(file, type);
      
      setFormData(prev => ({
        ...prev,
        [`${type}Url`]: fileUrl
      }));
      
      console.log('✅ File uploaded successfully!');
      
    } catch (error) {
      console.error('❌ File upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Lesson title is required');
      return;
    }
    
    if (formData.type === 'video' && !formData.videoUrl) {
      alert('Please upload a video file');
      return;
    }
    
    if (formData.type === 'pdf' && !formData.pdfUrl) {
      alert('Please upload a PDF file');
      return;
    }
    
    if (formData.type === 'text' && !formData.content.trim()) {
      alert('Please add text content');
      return;
    }

    onSave(formData);
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, fileType);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {lesson ? 'Edit Lesson' : 'Add New Lesson'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Scales"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this lesson covers..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (MM:SS)</label>
              <input
                type="text"
                placeholder="15:30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFreePreview"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.isFreePreview}
                onChange={(e) => setFormData({ ...formData, isFreePreview: e.target.checked })}
              />
              <label htmlFor="isFreePreview" className="ml-2 block text-sm text-gray-700">
                Free Preview Lesson
              </label>
            </div>
          </div>

          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video File *</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              {formData.videoUrl && (
                <p className="text-sm text-green-600 mt-2">Video uploaded successfully</p>
              )}
            </div>
          )}

          {formData.type === 'pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF File *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'pdf')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              {formData.pdfUrl && (
                <p className="text-sm text-green-600 mt-2">PDF uploaded successfully</p>
              )}
            </div>
          )}

          {formData.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your lesson content here..."
                disabled={uploading}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : lesson ? 'Update Lesson' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getInitialCourseForm = () => ({
  title: '',
  subtitle: '',
  shortDescription: '',
  description: '',
  category: '',
  tags: [],
  level: 'Beginner',
  language: 'English',
  thumbnailUrl: '',
  promoVideoUrl: '',
  price: 0,
  currency: 'INR',
  isFree: false,
  offerPrice: '',
  duration: '',
  totalDurationSeconds: 0,
  prerequisites: [''],
  whatYouWillLearn: [''],
  requirements: [''],
  modules: [],
  instructor: {
    name: '',
    bio: '',
    email: '',
    profileImage: '',
    socialLinks: {
      youtube: '',
      instagram: '',
      facebook: '',
      website: ''
    }
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: ['']
  },
  publish: {
    status: 'draft'
  },
  visibility: 'public',
  stats: {
    enrolledStudents: 0,
    rating: 0,
    totalReviews: 0,
    totalLessons: 0
  }
});

export default CourseFormModal;