import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt, generateHash } from '@/lib/encryption';
import { checkDbConnection } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const dbStatus = await checkDbConnection();
    if (!dbStatus.connected) {
      console.error('Could not connect to database:', dbStatus.error);
      return NextResponse.json(
        { error: 'Database connection error', message: 'Could not connect to database. Please try again later.' },
        { status: 503 }
      );
    }
    
    const data = await request.json();
    const { alias, email, message, priority, captchaCode } = data;
    
    if (!email || !message || !captchaCode) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'All fields marked with * are required' },
        { status: 400 }
      );
    }
    
    if (!captchaCode || captchaCode.trim() === '') {
      return NextResponse.json(
        { error: 'Verification failed', message: 'Please complete the security verification' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address', message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    const validPriorities = ['URGENT', 'NORMAL', 'LOW'];
    const finalPriority = validPriorities.includes(priority) ? priority : 'NORMAL';
    
    const encryptedEmail = encrypt(email);
    const encryptedMessage = encrypt(message);
    const encryptedAlias = encrypt(alias || 'Anonymous');
    
    const verificationHash = generateHash(`${alias}:${email}:${message}:${new Date().toISOString()}`);
    
    const contactMessage = await prisma.contactMessage.create({
      data: {
        alias: encryptedAlias,
        email: encryptedEmail,
        message: encryptedMessage,
        priority: finalPriority,
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
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Duplicate entry', message: 'This record already exists' },
        { status: 400 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Record not found', message: 'Could not find the requested record' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error processing request', message: error.message || 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
} 