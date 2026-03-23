import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { NutrientInput } from '$lib/server/db/schema';
import { nutrientApi } from '$lib/server/db/nutrient';

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			const name = formData.get('name')?.toString();

			if (name) {
				const input: NutrientInput = {
					name
				};

				const results = await nutrientApi.createNutrient(input);

				if (results[0].affectedRows > 0) {
					return { status: 200, message: 'Nutrient created successfully!', errors: [] };
				}

				return fail(400, { errors: ['Something went wrong inserting nutrient.'] });
			}
			return fail(400, { errors: ['Name is required.'] });
		} catch (err) {
			console.log(err);
			return error(500, { message: 'Something unexpect happened.' });
		}
	}
};
