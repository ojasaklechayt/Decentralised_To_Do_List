// app/api/tasks/[id].js
import Tasks from "@/models/notes";
import { connectToDatabase } from "@/utils/mongodb";

export const PUT = async(req, res) => {
    try {
        const { title, description, time, category, completed } = req.body;
        const { id } = req.query;
        const result = await Tasks.findByIdAndUpdate(id, { title, description, time, category, completed }, { new: true });
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response("Failed to update task", { status: 500 })
    }
}

export const DELETE = async(req, res) => {
    try {
        const { id } = req.query;
        const result = await Tasks.findByIdAndDelete(id);
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response("Failed to delete task", { status: 500 })
    }
}
