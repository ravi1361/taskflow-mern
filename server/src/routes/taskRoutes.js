import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';

const router = express.Router();

// Dashboard statistics (defined before /:id to prevent route shadowing)
router.get('/stats', getTaskStats);

// Tasks collection endpoints
router.route('/').get(getTasks).post(createTask);

// Individual task endpoints
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
