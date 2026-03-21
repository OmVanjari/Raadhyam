import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  List, 
  ChevronDown, 
  ChevronUp,
  Move,
  PlayCircle,
  FileText,
  Music,
  Type,
  Eye
} from 'lucide-react';
import LessonList from './LessonList';

const ModuleList = ({ 
  modules, 
  onAddModule, 
  onEditModule, 
  onDeleteModule, 
  onAddLesson, 
  onEditLesson, 
  onDeleteLesson,
  onSaveModules 
}) => {
  const [expandedModules, setExpandedModules] = useState({});
  const [draggingModule, setDraggingModule] = useState(null);
//   const [draggingLesson, setDraggingLesson] = useState(null);

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };



  // Module Drag & Drop
  const handleModuleDragStart = (e, index) => {
    setDraggingModule(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleModuleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleModuleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggingModule === null || draggingModule === targetIndex) return;

    const updatedModules = [...modules];
    const [movedModule] = updatedModules.splice(draggingModule, 1);
    updatedModules.splice(targetIndex, 0, movedModule);

    // Update positions
    const reorderedModules = updatedModules.map((module, index) => ({
      ...module,
      position: index
    }));

    onSaveModules(reorderedModules);
    setDraggingModule(null);
  };

  const calculateModuleStats = (module) => {
    const totalLessons = module.lessons?.length || 0;
    
    let totalDuration = 0;
    module.lessons?.forEach(lesson => {
      if (lesson.duration) {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        totalDuration += (minutes * 60) + (seconds || 0);
      }
    });
    
    const minutes = Math.floor(totalDuration / 60);
    
    return {
      totalLessons,
      duration: `${minutes}m`
    };
  };

  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <List size={24} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your course by creating your first module. Modules help organize your content into logical sections.
          </p>
          <button
            onClick={onAddModule}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Plus size={20} className="mr-2" />
            Create First Module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
            <p className="text-gray-600">
              {modules.length} modules • {modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
            </p>
          </div>
          <button
            onClick={onAddModule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Module
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const stats = calculateModuleStats(module);
          const isExpanded = expandedModules[moduleIndex];
          
          return (
            <div
              key={moduleIndex}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all ${
                draggingModule === moduleIndex ? 'opacity-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleModuleDragStart(e, moduleIndex)}
              onDragOver={(e) => handleModuleDragOver(e, moduleIndex)}
              onDrop={(e) => handleModuleDrop(e, moduleIndex)}
            >
              {/* Module Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-move"
                        title="Drag to reorder"
                      >
                        <Move size={16} />
                      </button>
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <List size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{module.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {module.description || 'No description'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{stats.totalLessons} lessons</span>
                        <span>•</span>
                        <span>{stats.duration}</span>
                        {module.lessons?.some(lesson => lesson.isFreePreview) && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 flex items-center">
                              <Eye size={14} className="mr-1" />
                              Free preview available
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onAddLesson(moduleIndex)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Add Lesson"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => onEditModule(module, moduleIndex)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                      title="Edit Module"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteModule(moduleIndex)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete Module"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              {isExpanded && (
                <div className="bg-gray-50 p-6">
                  <LessonList
                    lessons={module.lessons || []}
                    moduleIndex={moduleIndex}
                    onEditLesson={onEditLesson}
                    onDeleteLesson={onDeleteLesson}
                    onSaveLessons={(updatedLessons) => {
                      const updatedModules = [...modules];
                      updatedModules[moduleIndex].lessons = updatedLessons;
                      onSaveModules(updatedModules);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleList;