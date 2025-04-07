import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return Buffer.concat([iv, Buffer.from(encrypted, 'hex'), authTag]).toString('base64');
}

export function decrypt(encryptedText: string): string {
  const encryptedBuffer = Buffer.from(encryptedText, 'base64');
  
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  
  const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16);
  
  const encryptedContent = encryptedBuffer.slice(IV_LENGTH, encryptedBuffer.length - 16).toString('hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function generateHash(data: string): string {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
} 