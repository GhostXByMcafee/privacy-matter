import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error processing logout' },
      { status: 500 }
    );
  }
} 