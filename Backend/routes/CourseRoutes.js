import express from 'express';
const router = express.Router();
import courseController from '../controllers/CourseController.js';
import verifyToken from '../middlewares/AuthmiddleWare.js';
import isAdmin from '../middlewares/isAdmin.js';

// Public routes: get courses (no auth required)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Admin protected routes: create, update, delete courses
router.post('/', verifyToken, isAdmin, courseController.createCourse);
router.put('/:id', verifyToken, isAdmin, courseController.updateCourse);
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);

export default router;
