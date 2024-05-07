// app/api/tasks/index.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export const PUT = async (req, res) => {
    try {
        const { title, description, time, category, completed } = req.body;
        const { id } = req.query;
        const result = await prisma.tasks.update({
            where: { id: id },
            data: { title, description, time, category, completed },
        });

        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response("Failed to update task", { status: 500 })
    }
}

export const DELETE = async (req, res) => {
    try {
        const { id } = req.query;
        const result = await prisma.tasks.delete({
            where: { id: id },
        });
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response("Failed to delete task", { status: 500 })
    }
}
