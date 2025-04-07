import { prisma } from '../../../lib/prisma';
import { encrypt, generateHash } from '../../../lib/encryption';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    const emailHash = generateHash(email);
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { emailHash }
    });
    
    if (existingSubscription) {
      return NextResponse.json(
        { message: 'This email is already subscribed' },
        { status: 200 }
      );
    }
    
    const encryptedEmail = encrypt(email);
    
    await prisma.newsletter.create({
      data: {
        email: encryptedEmail,
        emailHash,
        subscribedAt: new Date()
      }
    });
    
    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Error processing subscription' },
      { status: 500 }
    );
  }
} 