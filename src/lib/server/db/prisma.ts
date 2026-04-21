import 'dotenv/config';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from '../../../prisma/generated/prisma/client';
import { env } from 'prisma/config';

const adapter = new PrismaMssql(env('MS_DB_URL'));
export const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'error'] });
