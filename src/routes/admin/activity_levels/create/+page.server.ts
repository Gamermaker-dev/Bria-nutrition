import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { ActivityLevelInput } from '$lib/server/db/schema';
import { activityLevelController } from '$lib/server/controllers';

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
					name,
					multiplier: multiplier.toString(),
					description
				};

				const results = await activityLevelController.create(input);

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
