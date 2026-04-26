import { PrismaMssql } from '@prisma/adapter-mssql';
import 'dotenv/config';
import { PrismaClient } from '../../../prisma/generated/prisma/client';

const config = {
	server: process.env.DB_HOST ?? 'localhost',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
	database: process.env.DB_NAME ?? 'db',
	user: process.env.DB_USER ?? 'user',
	password: process.env.DB_PASS ?? 'pass',
	options: {
		encrypt: true,
		trustServerCertificate: true // For self-signed certificates
	}
};

const adapter = new PrismaMssql(config);
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
