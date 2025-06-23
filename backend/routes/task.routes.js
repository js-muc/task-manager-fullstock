const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  seedTasks // ✅ include this
} = require('../controllers/task.controller');

const protect = require('../middlewares/auth.middleware');

// ✅ Protect all routes below
router.use(protect);

// ✅ CRUD Routes
router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// ✅ Task Seeder Route
router.post('/seed', seedTasks);  // Already protected via router.use(protect)

module.exports = router;
