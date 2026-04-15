import { exit } from 'node:process';
import { db } from '.';
import { food } from './schema';
import fs from 'fs';
import { parse } from 'csv-parse';

const main = async () => {
	const CHUNK_SIZE = 500;

	console.log('Inserting food nutrients...');
	const parser = fs.createReadStream(`./src/lib/server/db/files/food.csv`).pipe(
		parse({
			columns: true,
			skip_empty_lines: true,
			skip_records_with_error: true
		})
	);

	await db.transaction(async (tx) => {
		let chunks = [];

		let input: { name: string; fdcId: number }[] = [];

		for await (const row of parser) {
			chunks.push(row);

			if (chunks.length >= CHUNK_SIZE) {
				chunks.forEach((c) => {
					input.push({ name: c.description, fdcId: c.fdc_id });
				});

				if (input.length > 0) {
					const res = await tx.insert(food).values(input);
					if (res[0].affectedRows > 0) console.info(`Inserted ${res[0].affectedRows} rows!`);
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
