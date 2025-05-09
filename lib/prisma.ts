import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export async function checkDbConnection() {
  try {
    await prisma.$connect()
    return { connected: true }
  } catch (error) {
    console.error('Error connecting to database:', error)
    return { connected: false, error }
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 