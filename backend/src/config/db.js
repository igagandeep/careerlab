import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Create PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('DB connected via Prisma');
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};

const disconnectDB = async () => await prisma.$disconnect();

export { prisma, connectDB, disconnectDB };
