// app/api/tasks/index.js
import Tasks from "@/models/notes";
import { connectToDatabase } from "@/utils/mongodb";

export const GET = async (req, res) => {
    try {
        await connectToDatabase();
        const tasks = await Tasks.find({});
        return new Response(JSON.stringify(tasks), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to fetch all tasks", { status: 500 })
    }
}

export const POST = async(req, res) => {
    try {
        const { title, description, time, category, completed } = req.body;
        const task = new Tasks({ title, description, time, category, completed });
        const result = await task.save();
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to create tasks", { status: 500 })
    }
}
