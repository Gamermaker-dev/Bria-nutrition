
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { nutrientController } from '$lib/server/controllers';
import { parse } from 'csv-parse/sync';
import type { NutrientInput } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const res = await nutrientController.get();

	if (res.status !== 200 && typeof res.message === 'string') {
		error(res.status, { message: res.message });
	}

	const nutrients = res.data;

	return { nutrients };
};

type importData = {
	id: string;
	name: string;
	unit_name: string;
	nutrient_nbr: string;
	rank: string;
};

export const actions: Actions = {
	import: async (event) => {
		try {
			const formData = await event.request.formData();

			const importFile = formData.get('importFile') as File | null;

			if (!importFile) {
				return fail(400, { errors: ['No file found.'] });
			}

			const fileContent = await importFile.text();

			const records = parse(fileContent, {
				columns: true,
				skip_empty_lines: true,
				skip_records_with_error: true
			}) as importData[];

			const nutrientInput: NutrientInput[] = records.map((r) => ({
				name: r.name,
				unit: r.unit_name,
				fdcNumber: isNaN(parseInt(r.nutrient_nbr, 10)) ? 0 : parseInt(r.nutrient_nbr, 10),
			}));

			if (nutrientInput.length > 0) {
				const res = await nutrientController.import(nutrientInput);

				if (res.status === 200) return { status: 200, message: 'Import success!', errors: [] };
			}

			return fail(400, { message: 'No data to import!' });
		} catch (err) {
			console.log(err);
			error(500, { message: 'Something unexpected happened' });
		}
	},
}
