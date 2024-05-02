import { Schema, model, models } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Tasks = models.Tasks || model('Tasks', taskSchema);

export default Tasks;
