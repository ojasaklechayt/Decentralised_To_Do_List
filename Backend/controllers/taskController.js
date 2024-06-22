const Task = require('../models/Tasks');

// Handle GET requests
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle POST requests
exports.createTask = async (req, res) => {
    const { title, description, time, category, completed } = req.body;

    const newTask = new Task({
        title,
        description,
        time: new Date(time),
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
