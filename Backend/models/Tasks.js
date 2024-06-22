const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    time: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { collection: 'Tasks' });

module.exports = mongoose.model('Tasks', TaskSchema);
