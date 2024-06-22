const Task = require('../models/Tasks');

// Handle GET requests - Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle POST requests - Create a task
exports.createTask = async (req, res) => {
    const { title, description, category, completed } = req.body;

    const newTask = new Task({
        title,
        description,
        time: new Date(),
        category,
        completed
    });

    try {
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// PUT update task by ID
exports.updateTask = async (req, res) => {
    const { title, description, category, completed } = req.body;
    const { id } = req.params;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, {
            title,
            description,
            time: new Date(),
            category,
            completed
        }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE task by ID
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(deletedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET single task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH update specific fields of a task
exports.updateSpecificFields = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET tasks by category
exports.getTasksByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const tasks = await Task.find({ category });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found in this category' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET tasks by completion status
exports.getTasksByCompletionStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const completed = status === 'true'; // Convert string to boolean
        const tasks = await Task.find({ completed });

        if (tasks.length === 0) {
            return res.status(404).json({ message: `No tasks found with completion status ${status}` });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT mark task as completed
exports.markTaskAsCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE all completed tasks
exports.deleteCompletedTasks = async (req, res) => {
    try {
        const result = await Task.deleteMany({ completed: true });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No completed tasks found to delete' });
        }

        res.status(200).json({ message: `Deleted ${result.deletedCount} completed tasks` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE all tasks
exports.deleteAllTasks = async (req, res) => {
    try {
        const result = await Task.deleteMany({});

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
