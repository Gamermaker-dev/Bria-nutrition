import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { activityLevelController } from '$lib/server/controllers';
import { checkForErrors } from '$lib/util';
import type { ActivityLevelInput } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	const id: number = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		error(400, { message: 'Invalid activity level ID!' });
	}

	const res = await activityLevelController.getById(id);

	checkForErrors(res);

	return { activityLevel: res.data };
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			const name = formData.get('name')?.toString();
			const multiplier = parseFloat(formData.get('multiplier')?.toString() ?? '');
			const description = formData.get('description')?.toString();

			if (isNaN(multiplier)) return fail(400, { errors: ['Invalid multiplier!'] });

			if (name && description) {
				const input: ActivityLevelInput = {
					id: parseInt(event.params.id, 10),
					name,
					multiplier: multiplier.toString(),
					description
				};

				const results = await activityLevelController.update(input);

				if ((results.data?.[0].affectedRows ?? 0) > 0) {
					return { status: 200, message: 'Activity Level created successfully!', errors: [] };
				}

				return fail(400, { errors: ['Something went wrong inserting activity level.'] });
			}
			return fail(400, { errors: ['Name and Description are required.'] });
		} catch (err) {
			console.log(err);
			return error(500, { message: 'Something unexpected happened.' });
		}
	}
};
