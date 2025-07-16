import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET /api/users/[id] - Obtener un usuario específico por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando GET /api/users/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const usuario = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                email: true,
                role: true,
                iniciativasResponsable: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true,
                        fecha_inicio: true,
                        fecha_fin: true,
                        progreso: true,
                        kpi: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                }
            }
        });

        if (!usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        console.log('✅ [API] Usuario encontrado:', usuario);
        return NextResponse.json(usuario);

    } catch (error) {
        console.error('❌ [API] Error en GET /api/users/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener usuario',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// PUT /api/users/[id] - Actualizar un usuario específico
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando PUT /api/users/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const body = await req.json();
        const { nombre, email, password, role } = body;

        console.log('📝 [API] Datos recibidos:', { id, nombre, email, role, password: password ? '***' : 'no actualizado' });

        if (!nombre || !email || !role) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'Nombre, email y role son requeridos' }, { status: 400 });
        }

        // Verificar que el usuario existe
        const usuarioExistente = await prisma.user.findUnique({
            where: { id }
        });

        if (!usuarioExistente) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Verificar que el email no esté en uso por otro usuario
        const emailEnUso = await prisma.user.findFirst({
            where: {
                email,
                id: { not: id }
            }
        });

        if (emailEnUso) {
            return NextResponse.json({ error: 'El email ya está en uso por otro usuario' }, { status: 400 });
        }

        // Preparar datos para actualización
        const datosActualizacion: any = {
            nombre,
            email,
            role
        };

        // Solo actualizar password si se proporciona uno nuevo
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            datosActualizacion.password = hashedPassword;
        }

        const usuarioActualizado = await prisma.user.update({
            where: { id },
            data: datosActualizacion,
            select: {
                id: true,
                nombre: true,
                email: true,
                role: true
            }
        });

        console.log('✅ [API] Usuario actualizado:', usuarioActualizado);
        return NextResponse.json(usuarioActualizado);

    } catch (error) {
        console.error('❌ [API] Error en PUT /api/users/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al actualizar usuario',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// DELETE /api/users/[id] - Eliminar un usuario específico
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando DELETE /api/users/[id]...');
        const id = parseInt(params.id);

        console.log('📝 [API] ID recibido para eliminar:', id);

        if (isNaN(id)) {
            console.log('❌ [API] Validación fallida: ID debe ser un número válido');
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        // Verificar que el usuario existe antes de eliminarlo
        const usuarioExistente = await prisma.user.findUnique({
            where: { id }
        });

        if (!usuarioExistente) {
            console.log('❌ [API] Usuario no encontrado para eliminar');
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const usuarioEliminado = await prisma.user.delete({
            where: { id },
            select: {
                id: true,
                nombre: true,
                email: true,
                role: true
            }
        });

        console.log('✅ [API] Usuario eliminado:', usuarioEliminado);
        return NextResponse.json({ 
            message: 'Usuario eliminado exitosamente',
            usuario: usuarioEliminado 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ [API] Error en DELETE /api/users/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al eliminar usuario',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
