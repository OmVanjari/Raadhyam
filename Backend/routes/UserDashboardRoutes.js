/**
 * User Dashboard Routes - Authenticated user operations
 * 
 * Endpoints:
 * - GET /api/user/courses - Get user's enrolled courses
 * - POST /api/user/notes - Create user note
 * - GET /api/user/notes/:id - Get specific note
 * 
 * Protection:
 * - All routes require verifyToken middleware (authenticated user only)
 * - No admin role required - any authenticated user can access
 * 
 * Validation:
 * - Note creation validates courseId and content
 * - Note retrieval validates MongoDB ObjectId format
 * 
 * Ownership:
 * - Notes are automatically linked to authenticated user on creation
 * - Users can only retrieve their own notes (ownership check)
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import { getUserCourses, enrollInCourse, createNote, getNoteById } from '../controllers/UserDashboardController.js';

const router = express.Router();

/**
 * Validation error handler middleware - standardized format
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Validation rules for creating a note
 */
const validateCreateNote = [
  body('courseId')
    .trim()
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID format'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Note content is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  validate
];

/**
 * Validation rules for note ID parameter
 */
const validateNoteId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Note ID is required')
    .isMongoId()
    .withMessage('Invalid note ID format'),
  
  validate
];

/**
 * Validation rules for enrolling in a course
 */
const validateEnroll = [
  body('courseId')
    .trim()
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID format'),
  
  validate
];

// GET /api/user/courses - Get user's enrolled courses (requires auth)
// Returns courses where the authenticated user has an active enrollment
router.get('/courses', verifyToken, getUserCourses);

// POST /api/user/enroll - Enroll in a course (requires auth + validation)
// Body: courseId (required)
// Creates a new enrollment or reactivates existing one
router.post('/enroll', verifyToken, validateEnroll, enrollInCourse);

// POST /api/user/notes - Create user note (requires auth + validation)
// Body: courseId (required), content (required), title (optional)
// Creates a note linked to both the authenticated user and the specified course
router.post('/notes', verifyToken, validateCreateNote, createNote);

// GET /api/user/notes/:id - Get specific note (requires auth + validation)
// Returns note only if it belongs to the authenticated user
// Returns 403 if note belongs to another user
router.get('/notes/:id', verifyToken, validateNoteId, getNoteById);

export default router;
