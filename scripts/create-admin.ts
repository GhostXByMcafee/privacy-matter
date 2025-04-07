import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function createAdmin() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4];
    
    if (!email || !password || !name) {
      console.error('Usage: npm run create-admin <email> <password> <name>');
      process.exit(1);
    }
    
    const hashedPassword = await hashPassword(password);
    
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: 'SUPER_ADMIN'
      }
    });
    
    console.log('Admin created successfully:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin(); 