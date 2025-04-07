import { NextResponse } from 'next/server';
import { getSessionAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getSessionAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Error checking session' },
      { status: 500 }
    );
  }
} 