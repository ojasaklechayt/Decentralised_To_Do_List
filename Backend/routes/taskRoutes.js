const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    updateSpecificFields,
    getTasksByCategory,
    getTasksByCompletionStatus,
    markTaskAsCompleted,
    deleteAllTasks
} = require('../controllers/taskController');

// Routes
router.route('/')
    .get(getTasks)
    .post(createTask).delete(deleteAllTasks);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask).get(getTaskById).patch(updateSpecificFields);

router.get('/category/:category', getTasksByCategory);
router.get('/completed/:status', getTasksByCompletionStatus);
router.put('/:id/complete', markTaskAsCompleted);
module.exports = router;
