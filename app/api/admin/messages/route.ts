import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const admin = await requireAuth('VIEWER');
    
    // Obtener parámetros de paginación y filtros
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    // Construir query
    const where = {
      ...(status && { status: status as 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'ARCHIVED' }),
      ...(priority && { priority: priority as 'URGENT' | 'NORMAL' | 'LOW' })
    };
    
    // Obtener total de mensajes
    const total = await prisma.contactMessage.count({ where });
    
    // Obtener mensajes paginados
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });
    
    // Desencriptar mensajes
    const decryptedMessages = messages.map(msg => ({
      id: msg.id,
      alias: decrypt(msg.alias),
      email: decrypt(msg.email),
      message: decrypt(msg.message),
      priority: msg.priority,
      status: msg.status,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt
    }));
    
    return NextResponse.json({
      messages: decryptedMessages,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error retrieving messages' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Verificar autenticación con rol mínimo de ADMIN
    const admin = await requireAuth('ADMIN');
    
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Message ID and status are required' },
        { status: 400 }
      );
    }
    
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        status: message.status
      }
    });
  } catch (error) {
    console.error('Error actualizando mensaje:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error updating message' },
      { status: 500 }
    );
  }
} 