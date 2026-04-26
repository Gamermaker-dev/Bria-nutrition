import { PrismaMssql } from '@prisma/adapter-mssql';
import 'dotenv/config';
import { PrismaClient } from '../../../prisma/generated/prisma/client';

const adapter = new PrismaMssql(process.env.DATABASE_URL ?? 'sqlserver://localhost:1433;database-placeholder;encrypt=true;trustServerCertificate=true;');
const base = new PrismaClient({
	adapter,
	log: [{ emit: 'event', level: 'query' }, 'info', { emit: 'event', level: 'error' }]
});

base.$on('query', (e) => {
	console.log('Query: ' + e.query);
	console.log('Params: ' + e.params); // This contains the actual parameters
	console.log('Duration: ' + e.duration + 'ms');
});

base.$on('error', (e) => {
	console.log('Message: ' + e.message);
	console.log('Target: ' + e.target); // This contains the actual parameters
	console.log('Timestamp: ' + e.timestamp);
});

export const prisma = base.$extends({
	result: {
		$allModels: {
			$allFields: {
				compute(value) {
					// Convert any BigInt field found to a Number
					return typeof value === 'bigint' ? Number(value) : value;
				}
			}
		}
	}
});
