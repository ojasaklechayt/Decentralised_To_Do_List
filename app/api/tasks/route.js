// app/api/tasks/index.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
export const GET = async () => {
    try {
        const tasks = await prisma.tasks.findMany();
        return new Response(JSON.stringify(tasks), { status: 200 })
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch all tasks", { status: 500 })
    }
}

export const POST = async (request) => {
    try {
        const { title, description, time, category, completed } = await request.json();
        console.log("Hello", title, description, time, category, completed);
        const task = new prisma.tasks.create({ data: { title, description, time, category, completed } });
        return new Response(JSON.stringify(task), { status: 201 })
    } catch (error) {
        console.error(error);
        return new Response("Failed to create task", { status: 500 })
    }
}
