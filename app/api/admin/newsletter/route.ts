import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const admin = await requireAuth('VIEWER');
    
    // Obtener parámetros de paginación
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const active = searchParams.get('active') === 'true';
    
    // Construir query
    const where = searchParams.get('active') ? {
      active: searchParams.get('active') === 'true'
    } : {};
    
    // Obtener total de suscripciones
    const total = await prisma.newsletter.count({ where });
    
    // Obtener suscripciones paginadas
    const subscriptions = await prisma.newsletter.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });
    
    // Desencriptar emails
    const decryptedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      email: decrypt(sub.email),
      emailHash: sub.emailHash,
      subscribedAt: sub.subscribedAt,
      active: sub.active
    }));
    
    return NextResponse.json({
      subscriptions: decryptedSubscriptions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });
  } catch (error) {
    console.error('Error obteniendo suscripciones:', error);
    
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
      { error: 'Error retrieving subscriptions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Verificar autenticación con rol mínimo de ADMIN
    const admin = await requireAuth('ADMIN');
    
    const { id, active } = await request.json();
    
    if (!id || typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'Subscription ID and active status are required' },
        { status: 400 }
      );
    }
    
    const subscription = await prisma.newsletter.update({
      where: { id },
      data: { active }
    });
    
    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        active: subscription.active
      }
    });
  } catch (error) {
    console.error('Error actualizando suscripción:', error);
    
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
      { error: 'Error updating subscription' },
      { status: 500 }
    );
  }
} 