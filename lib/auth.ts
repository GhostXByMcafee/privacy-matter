import { prisma } from './prisma';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createAuthToken(adminId: string, role: string): Promise<string> {
  return sign(
    { adminId, role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export async function verifyAuthToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { adminId: string; role: string };
  } catch {
    return null;
  }
}

export async function getSessionAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyAuthToken(token);
    if (!payload) {
      return null;
    }
    
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    return admin;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function requireAuth(requiredRole?: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER') {
  const admin = await getSessionAdmin();
  
  if (!admin) {
    throw new Error('Authentication required');
  }
  
  if (requiredRole) {
    const roleHierarchy: Record<string, number> = {
      SUPER_ADMIN: 3,
      ADMIN: 2,
      VIEWER: 1
    };
    
    if (roleHierarchy[admin.role] < roleHierarchy[requiredRole]) {
      throw new Error('Insufficient permissions');
    }
  }
  
  return admin;
} 