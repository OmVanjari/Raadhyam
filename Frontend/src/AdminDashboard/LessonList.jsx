import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Move, 
  Eye,
  PlayCircle,
  FileText,
  Music,
  Type,
  Clock
} from 'lucide-react';

const LessonList = ({ 
  lessons, 
  moduleIndex, 
  onEditLesson, 
  onDeleteLesson, 
  onSaveLessons 
}) => {
  const [draggingLesson, setDraggingLesson] = useState(null);

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle size={16} className="text-red-600" />;
      case 'audio': return <Music size={16} className="text-purple-600" />;
      case 'pdf': return <FileText size={16} className="text-orange-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'pdf': return 'bg-orange-100 text-orange-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Lesson Drag & Drop
  const handleLessonDragStart = (e, index) => {
    setDraggingLesson(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLessonDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleLessonDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggingLesson === null || draggingLesson === targetIndex) return;

    const updatedLessons = [...lessons];
    const [movedLesson] = updatedLessons.splice(draggingLesson, 1);
    updatedLessons.splice(targetIndex, 0, movedLesson);

    // Update positions
    const reorderedLessons = updatedLessons.map((lesson, index) => ({
      ...lesson,
      position: index
    }));

    onSaveLessons(reorderedLessons);
    setDraggingLesson(null);
  };

  const moveLesson = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= lessons.length) return;

    const updatedLessons = [...lessons];
    [updatedLessons[index], updatedLessons[newIndex]] = [updatedLessons[newIndex], updatedLessons[index]];
    
    // Update positions
    const reorderedLessons = updatedLessons.map((lesson, idx) => ({
      ...lesson,
      position: idx
    }));

    onSaveLessons(reorderedLessons);
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-100 p-4 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
          <PlayCircle size={20} className="text-gray-600" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h4>
        <p className="text-gray-600 mb-4">Add lessons to start building your module content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Lessons ({lessons.length})</h4>
      </div>

      <div className="space-y-2">
        {lessons.map((lesson, lessonIndex) => (
          <div
            key={lessonIndex}
            className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all ${
              draggingLesson === lessonIndex ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleLessonDragStart(e, lessonIndex)}
            onDragOver={(e) => handleLessonDragOver(e, lessonIndex)}
            onDrop={(e) => handleLessonDrop(e, lessonIndex)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Drag and Reorder Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveLesson(lessonIndex, -1)}
                    disabled={lessonIndex === 0}
                    className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-30"
                    title="Move up"
                  >
                    <Move size={16} className="rotate-90" />
                  </button>
                  <button
                    onClick={() => moveLesson(lessonIndex, 1)}
                    disabled={lessonIndex === lessons.length - 1}
                    className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-30"
                    title="Move down"
                  >
                    <Move size={16} className="-rotate-90" />
                  </button>
                </div>

                {/* Lesson Icon */}
                <div className={`p-2 rounded-lg ${getLessonTypeColor(lesson.type)}`}>
                  {getLessonIcon(lesson.type)}
                </div>

                {/* Lesson Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                    {lesson.isFreePreview && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <Eye size={12} className="mr-1" />
                        Free Preview
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="capitalize">{lesson.type}</span>
                    {lesson.duration && (
                      <>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {lesson.duration}
                        </span>
                      </>
                    )}
                    {lesson.description && (
                      <>
                        <span>•</span>
                        <span className="truncate">{lesson.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditLesson(lesson, moduleIndex, lessonIndex)}
                  className="text-gray-600 hover:text-gray-800 p-2"
                  title="Edit Lesson"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDeleteLesson(moduleIndex, lessonIndex)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Delete Lesson"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lesson Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => onEditLesson(null, moduleIndex, null)}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
        >
          <Plus size={16} className="mr-1" />
          Add Lesson to this Module
        </button>
      </div>
    </div>
  );
};

export default LessonList;