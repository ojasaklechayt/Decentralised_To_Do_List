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

export const POST = async (request) => {
    const { title, description, time, category, completed } = await request.json();
    console.log("Hello", title, description, time, category, completed);
    try {
        await connectToDatabase();
        const task = new Tasks({ title, description, time, category, completed });
        await task.save();
        return new Response(JSON.stringify(task), { status: 201 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to create task", { status: 500 })
    }
}