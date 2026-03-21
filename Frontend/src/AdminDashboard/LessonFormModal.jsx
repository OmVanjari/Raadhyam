import React, { useState, useEffect } from 'react';
import { X, PlayCircle, FileText, Type, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [ setFileSelected] = useState(false);

  useEffect(() => {
    if (lesson) {
      // Set file selected if editing and file already exists
      if ((lesson.type === 'video' && lesson.videoUrl) || 
          (lesson.type === 'pdf' && lesson.pdfUrl)) {
        setFileSelected(true);}
    }
  }, [lesson]);

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      setFileSelected(true);
      
      console.log(`📤 Starting ${type} upload:`, file.name);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const fileUrl = await uploadFile(file, type);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show 100% progress
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          [`${type}Url`]: fileUrl
        }));
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
      setUploadProgress(0);
      setFileSelected(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Lesson title is required');
      return;
    }
    
    // ✅ VALIDATE THAT FILE IS UPLOADED BASED ON TYPE
    if (formData.type === 'video' && !formData.videoUrl) {
      alert('Please upload a video file before saving the lesson');
      return;
    }
    
    if (formData.type === 'pdf' && !formData.pdfUrl) {
      alert('Please upload a PDF file before saving the lesson');
      return;
    }
    
    if (formData.type === 'text' && !formData.content.trim()) {
      alert('Please add text content before saving the lesson');
      return;
    }

    // ✅ Create clean lesson data structure
    const cleanLessonData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      duration: formData.duration || '00:00',
      isFreePreview: formData.isFreePreview || false,
      // ✅ Only include relevant fields based on type
      ...(formData.type === 'video' && { 
        videoUrl: formData.videoUrl,
        pdfUrl: undefined,
        content: undefined 
      }),
      ...(formData.type === 'pdf' && { 
        pdfUrl: formData.pdfUrl,
        videoUrl: undefined,
        content: undefined 
      }),
      ...(formData.type === 'text' && { 
        content: formData.content,
        videoUrl: undefined,
        pdfUrl: undefined 
      })
    };

    // ✅ Remove undefined fields
    Object.keys(cleanLessonData).forEach(key => {
      if (cleanLessonData[key] === undefined) {
        delete cleanLessonData[key];
      }
    });

    console.log('✅ Saving lesson data:', cleanLessonData);
    onSave(cleanLessonData);
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, fileType);
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType
    }));
    setFileSelected(false);
    setUploadError(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'text': return <Type size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getFileRequirements = (type) => {
    switch (type) {
      case 'video':
        return 'MP4, MOV, or other video formats (max 5MB)';
      case 'pdf':
        return 'PDF files only (max 2MB)';
      case 'text':
        return 'Write your lesson content in the text area below';
      default:
        return '';
    }
  };

  const renderFileUploadSection = () => {
    switch (formData.type) {
      case 'video':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File *
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              
              <p className="text-xs text-gray-500">
                {getFileRequirements('video')}
              </p>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Upload Error */}
              {uploadError && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle size={16} className="mr-2" />
                  {uploadError}
                </div>
              )}
              
              {/* Success Message */}
              {formData.videoUrl && !uploading && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Video uploaded successfully
                </p>
              )}
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File *
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'pdf')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              
              <p className="text-xs text-gray-500">
                {getFileRequirements('pdf')}
              </p>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading PDF...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Upload Error */}
              {uploadError && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle size={16} className="mr-2" />
                  {uploadError}
                </div>
              )}
              
              {/* Success Message */}
              {formData.pdfUrl && !uploading && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  PDF uploaded successfully
                </p>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div className="space-y-2">
              <textarea
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your lesson content here... You can use markdown formatting for better presentation."
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                {getFileRequirements('text')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    if (!formData.title.trim()) return false;
    
    switch (formData.type) {
      case 'video':
        return !!formData.videoUrl && !uploading;
      case 'pdf':
        return !!formData.pdfUrl && !uploading;
      case 'text':
        return !!formData.content.trim() && !uploading;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {lesson ? 'Edit Lesson' : 'Add New Lesson'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={uploading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lesson Type Selection */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Lesson Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'video', label: 'Video', icon: PlayCircle },
                { value: 'pdf', label: 'PDF', icon: FileText },
                { value: 'text', label: 'Text', icon: Type }
              ].map((typeOption) => {
                const Icon = typeOption.icon;
                const isSelected = formData.type === typeOption.value;
                const isDisabled = uploading;
                
                return (
                  <button
                    key={typeOption.value}
                    type="button"
                    onClick={() => handleTypeChange(typeOption.value)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Icon size={20} className="mx-auto mb-1" />
                    <span className="text-sm font-medium">{typeOption.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Scales"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (MM:SS)
              </label>
              <input
                type="text"
                placeholder="15:30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                disabled={uploading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this lesson covers..."
              disabled={uploading}
            />
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isFreePreview"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.isFreePreview}
              onChange={(e) => setFormData({ ...formData, isFreePreview: e.target.checked })}
              disabled={uploading}
            />
            <label htmlFor="isFreePreview" className="ml-3 block text-sm text-gray-700">
              <span className="font-medium">Free Preview Lesson</span>
              <p className="text-gray-500 text-xs mt-1">
                Students can access this lesson without enrolling in the course
              </p>
            </label>
          </div>

          {/* Content Section based on type */}
          <div className="border-t pt-6">
            {renderFileUploadSection()}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  {getTypeIcon(formData.type)}
                  <span className="ml-2">
                    {lesson ? 'Update Lesson' : 'Add Lesson'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Validation Help Text */}
          {!canSubmit() && !uploading && (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              {!formData.title.trim() ? (
                <p>⚠️ Please enter a lesson title</p>
              ) : formData.type === 'video' && !formData.videoUrl ? (
                <p>⚠️ Please upload a video file to continue</p>
              ) : formData.type === 'pdf' && !formData.pdfUrl ? (
                <p>⚠️ Please upload a PDF file to continue</p>
              ) : formData.type === 'text' && !formData.content.trim() ? (
                <p>⚠️ Please add text content to continue</p>
              ) : null}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LessonFormModal;