import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    // Verificar autenticación
    await requireAuth('VIEWER');
    
    // Obtener estadísticas de mensajes
    const totalMessages = await prisma.contactMessage.count();
    const urgentMessages = await prisma.contactMessage.count({
      where: { priority: 'URGENT' }
    });
    const pendingMessages = await prisma.contactMessage.count({
      where: { status: 'PENDING' }
    });
    
    // Obtener estadísticas de newsletter
    const totalSubscribers = await prisma.newsletter.count();
    const activeSubscribers = await prisma.newsletter.count({
      where: { active: true }
    });
    
    return NextResponse.json({
      messages: {
        total: totalMessages,
        urgent: urgentMessages,
        pending: pendingMessages
      },
      newsletter: {
        total: totalSubscribers,
        active: activeSubscribers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
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
      { error: 'Error fetching stats' },
      { status: 500 }
    );
  }
} 