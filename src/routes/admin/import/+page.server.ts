import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parse } from 'csv-parse/sync';
import type { RecommendationInput } from '$lib/server/db/schema';
import { nutrientController, recommendationController } from '$lib/server/controllers';

type importData = {
	Age: string;
	Male: string;
	Female: string;
	Pregancy?: string;
	Lactation?: string;
};

export const load: PageServerLoad = async () => {
	try {
		const nutrients = await nutrientController.getDropdown();

		return { nutrients };
	} catch (err) {
		throw error(500, { message: `${err}` });
	}
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

		const inputs: RecommendationInput[] = jsonData.reduce((curr, val) => {
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

			const maleInput: RecommendationInput = {
				nutrientId,
				minAge,
				maxAge: maxAge !== 0 ? maxAge : undefined,
				physicalTypeId: 1,
				amount: parseFloat(val.Male.replaceAll(/\D/g, '').trim())
			};

			curr.push(maleInput);

			const femaleInput: RecommendationInput = {
				nutrientId,
				minAge,
				maxAge: maxAge !== 0 ? maxAge : undefined,
				physicalTypeId: 2,
				amount: parseFloat(val.Female.replaceAll(/\D/g, '').trim())
			};

			curr.push(femaleInput);

			if (val.Pregancy && val.Pregancy !== '') {
				const pregancyInput: RecommendationInput = {
					nutrientId,
					minAge,
					maxAge: maxAge !== 0 ? maxAge : undefined,
					physicalTypeId: 3,
					amount: parseFloat(val.Pregancy.replaceAll(/\D/g, '').trim())
				};

				curr.push(pregancyInput);
			}

			if (val.Lactation && val.Lactation !== '') {
				const lactationInput: RecommendationInput = {
					nutrientId,
					minAge,
					maxAge: maxAge !== 0 ? maxAge : undefined,
					physicalTypeId: 4,
					amount: parseFloat(val.Lactation.replaceAll(/\D/g, '').trim()),
				};

				curr.push(lactationInput);
			}

			return curr;
		}, [] as RecommendationInput[]);

		if (inputs.length === 0) return fail(400, { errors: ['Invalid input.'] });

		const results = await recommendationController.create(inputs);

		if (results.status === 200) {
			return { status: results.status, message: 'Successfully imported values!', errors: [] };
		}

		return fail(500, { errors: ['Failed to insert.'] });
	}
};
