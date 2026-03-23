import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parse } from 'csv-parse/sync';
import type { VitaminAgeDRIInput } from '$lib/server/db/schema';
import { nutrientApi } from '$lib/server/db/nutrient';
import { vitaminAgeDRIApi } from '$lib/server/db/vitamin_age_dri';

type importData = {
	Age: string;
	Male: string;
	Female: string;
	Pregancy?: string;
	Lactation?: string;
};

export const load: PageServerLoad = async () => {
	const nutrients = await nutrientApi.getNutrientDropdown();

	return { nutrients };
};

export const actions: Actions = {
	parse: async (event) => {
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

			return { status: 200, errors: [], records };
		} catch (err) {
			console.log(err);
			error(500, { message: 'Something unexpected happened' });
		}
	},

	importData: async (event) => {
		const formData = await event.request.formData();

		const formNutrientId: string | undefined = formData.get('nutrientId')?.toString();
		const data: string | undefined = formData.get('data')?.toString();

		if (!formNutrientId) return fail(400, { errors: ['Nutrient must be selected!'] });
		if (!data) return fail(400, { errors: ['No data!'] });

		const nutrientId: number = parseInt(formNutrientId, 10);
		const jsonData: importData[] = JSON.parse(data);

		console.log(jsonData);

		const inputs: VitaminAgeDRIInput[] = jsonData.reduce((curr, val) => {
			let minAge: number = 0;
			let maxAge: number = 0;

			const ageString = val.Age.replaceAll(/\D/g, ' ').trim().replaceAll(/\s+/g, ' ').split(' ');

			if (ageString.length === 1) {
				if (ageString[0].length > 1) {
					minAge = parseInt(ageString[0], 10);
				} else {
					maxAge = parseInt(ageString[0], 10);
				}
			} else if (ageString.length === 2) {
				minAge = parseInt(ageString[0], 10);
				maxAge = parseInt(ageString[1], 10);
			}

			const maleInput: VitaminAgeDRIInput = {
				nutrientId,
				minAge,
				maxAge: maxAge !== 0 ? maxAge : undefined,
				sex: 'male',
				amount: parseFloat(val.Male.replaceAll(/\D/g, '').trim()),
				isPregnant: false,
				isLactating: false
			};

			curr.push(maleInput);

			const femaleInput: VitaminAgeDRIInput = {
				nutrientId,
				minAge,
				maxAge: maxAge !== 0 ? maxAge : undefined,
				sex: 'female',
				amount: parseFloat(val.Female.replaceAll(/\D/g, '').trim()),
				isPregnant: false,
				isLactating: false
			};

			curr.push(femaleInput);

			if (val.Pregancy && val.Pregancy !== '') {
				const pregancyInput: VitaminAgeDRIInput = {
					nutrientId,
					minAge,
					maxAge: maxAge !== 0 ? maxAge : undefined,
					sex: 'female',
					amount: parseFloat(val.Pregancy.replaceAll(/\D/g, '').trim()),
					isPregnant: true,
					isLactating: false
				};

				curr.push(pregancyInput);
			}

			if (val.Lactation && val.Lactation !== '') {
				const lactationInput: VitaminAgeDRIInput = {
					nutrientId,
					minAge,
					maxAge: maxAge !== 0 ? maxAge : undefined,
					sex: 'female',
					amount: parseFloat(val.Lactation.replaceAll(/\D/g, '').trim()),
					isPregnant: false,
					isLactating: true
				};

				curr.push(lactationInput);
			}

			return curr;
		}, [] as VitaminAgeDRIInput[]);

		if (inputs.length === 0) return fail(400, { errors: ['Invalid input.'] });

		const results = await vitaminAgeDRIApi.bulkCreate(inputs);

		if (results[0].affectedRows > 0) {
			return { status: 200, message: 'Successfully imported values!', errors: [] };
		}

		return fail(500, { errors: ['Failed to insert.'] });
	}
};
