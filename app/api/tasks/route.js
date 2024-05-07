// app/api/tasks/index.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const GET = async () => {
    try {
        const tasks = await prisma.tasks.findMany();
        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        let errorMessage = "";
        let statusCode = 500;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma error:", error.message);
            errorMessage = "Failed to fetch all tasks: Database error";
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
            console.error("Prisma initialization error:", error.message);
            errorMessage = "Failed to fetch all tasks: Prisma initialization error";
        } else {
            console.error("Error fetching tasks:", error);
            errorMessage = "Failed to fetch all tasks: " + error.message;
        }

        return new Response(errorMessage, { status: statusCode });
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
