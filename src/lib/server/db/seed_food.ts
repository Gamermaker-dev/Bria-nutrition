import { parse } from 'csv-parse';
import fs from 'fs';
import { exit } from 'node:process';
import { prisma } from './prisma';

const main = async () => {
	const CHUNK_SIZE = 500;
	const TODAY = new Date();

	console.log('Inserting food nutrients...');
	const parser = fs.createReadStream(`./src/lib/server/db/files/food.csv`).pipe(
		parse({
			columns: true,
			skip_empty_lines: true,
			skip_records_with_error: true
		})
	);

	await prisma.$transaction(async (tx) => {
		let chunks = [];

		let input: { name: string; fdcId: number; dateAdded: Date }[] = [];

		for await (const row of parser) {
			chunks.push(row);

			if (chunks.length >= CHUNK_SIZE) {
				chunks.forEach((c) => {
					input.push({ name: c.description, fdcId: c.fdc_id, dateAdded: TODAY });
				});

				if (input.length > 0) {
					const res = await tx.food.createMany({
						data: input
					});
					if (res.count > 0) console.info(`Inserted ${res.count} rows!`);
					else console.info('Failed to insert any records');
				}
				input = [];
				chunks = [];
			}
		}
	});
};

main()
	.then(() => {
		console.info('Successfully inserted records');
		exit();
	})
	.catch((err) => {
		console.error(err);
		exit(1);
	});
