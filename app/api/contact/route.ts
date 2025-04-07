import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt, generateHash } from '@/lib/encryption';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { alias, email, message, priority, captchaCode } = data;
    
    if (!email || !message || !captchaCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    const encryptedEmail = encrypt(email);
    const encryptedMessage = encrypt(message);
    const encryptedAlias = encrypt(alias || 'Anonymous');
    
    const verificationHash = generateHash(`${alias}:${email}:${message}:${new Date().toISOString()}`);
    
    const contactMessage = await prisma.contactMessage.create({
      data: {
        alias: encryptedAlias,
        email: encryptedEmail,
        message: encryptedMessage,
        priority: priority as any,
      },
    });
    
    return NextResponse.json(
      { 
        success: true, 
        messageId: contactMessage.id,
        verificationHash 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing contact request:', error);
    
    return NextResponse.json(
      { error: 'Error processing request', details: error.message },
      { status: 500 }
    );
  }
} 