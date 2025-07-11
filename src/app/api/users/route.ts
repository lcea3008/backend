import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users

export async function GET() {
    try {
        console.log("🔍 [API] Iniciando GET /api/users...");

        const users = await prisma.user.findMany();

        console.log(`✅ [API] Encontrados ${users.length} usuarios`);

        return NextResponse.json(users);
    } catch (error) {
        console.error("❌ [API] Error en GET /api/users:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : "No stack trace",
            name: error instanceof Error ? error.name : "Unknown"
        });

        return NextResponse.json({
            error: "Error al obtener usuarios",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
