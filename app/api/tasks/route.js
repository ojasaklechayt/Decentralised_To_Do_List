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
    const body = await request.json();
    try {
        const task = await prisma.tasks.create({ data: { title: body.title, description: body.description, time: new Date(body.time), category: body.category, completed: body.completed } });
        return new Response(JSON.stringify(task), { status: 201 })
    } catch (error) {
        console.error(error);
        return new Response("Failed to create task", { status: 500 })
    }
}
