import { parse } from 'csv-parse/sync';
import { readFile } from 'node:fs/promises';
import { exit } from 'node:process';
import { nutrientController } from '../controllers';
import type { NutrientInput } from './schema';

type importData = {
	id: string;
	name: string;
	unit_name: string;
	nutrient_nbr: string;
	rank: string;
};

const main = async () => {
	const fileContent = await readFile(`./src/lib/server/db/files/nutrient.csv`, 'utf-8');

	console.log(fileContent);

	const records = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
		skip_records_with_error: true
	}) as unknown as importData[];

	console.log(records);

	const dateAdded = new Date();
	const nutrientInput: NutrientInput[] = records.map((r) => ({
		name: r.name,
		unit: r.unit_name,
		fdcNutrientId: isNaN(parseInt(r.id, 10)) ? 0 : parseInt(r.id, 10),
		fdcNumber: isNaN(parseInt(r.nutrient_nbr, 10)) ? 0 : parseInt(r.nutrient_nbr, 10),
		dateAdded
	}));

	if (nutrientInput.length > 0) {
		await nutrientController.import(nutrientInput);
	}
};

main()
	.then(() => exit())
	.catch(() => exit(1));
