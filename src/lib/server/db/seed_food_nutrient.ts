import { exit } from 'node:process';
import fs from 'fs';
import { parse } from 'csv-parse';
import { db } from '.';
import { fdcNutrient } from './schema';

const main = async () => {
	console.log('Inserting food nutrients...');
	const parser = fs.createReadStream(`./src/lib/server/db/files/food_nutrient.csv`).pipe(
		parse({
			columns: true,
			skip_empty_lines: true,
			skip_records_with_error: true
		})
	);

	const input: { fdcId: number; nutrientId: number; amount: number }[] = [];
	const CHUNK_SIZE = 500;

	for await (const row of parser) {
		let amount = row.amount;
		if (amount == '' || amount == null) amount = 0;
		input.push({ fdcId: row.fdc_id, nutrientId: row.nutrient_id, amount: amount });

		if (input.length >= CHUNK_SIZE) {
			await db.insert(fdcNutrient).values(input);
			input.length = 0;
		}
	}
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
