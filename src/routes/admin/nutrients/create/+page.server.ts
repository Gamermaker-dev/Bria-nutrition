import { nutrientController } from '$lib/server/controllers';
import type { NutrientInput } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			const name = formData.get('name')?.toString();
			const fdcNumbersRaw = formData.get('fdcNumbers')?.toString();
			const unit = formData.get('unit')?.toString();

			let fdcNumbers = '';

			if (fdcNumbersRaw) {
				fdcNumbersRaw.split(',').forEach((num) => {
					const valid = parseInt(num, 10);
					if (isNaN(valid))
						return fail(400, { message: 'FDC Numbers must be comma-seperated list of numbers.' });
					fdcNumbers += `${valid},`;
				});
			}

			fdcNumbers = fdcNumbers.substring(0, fdcNumbers.length - 1);

			if (name) {
				const input: NutrientInput = {
					name,
					fdcNumbers,
					unit
				};

				const results = await nutrientController.create(input);

				if ((results.data?.[0].affectedRows ?? 0) > 0) {
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
