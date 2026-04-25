import {
	activityLevelController,
	physicalTypeController,
	userController
} from '$lib/server/controllers';
import { updateProfileSchema } from '$lib/server/schemas';
import { checkForErrors, createNotification, parseZErrors } from '$lib/util';
import { error, fail } from '@sveltejs/kit';
import z from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const user = event.locals.user;

		if (!user) throw error(400, { message: 'Bad request.' });

		const profile = await userController.getById(user.id);
		checkForErrors(profile);

		const res = await activityLevelController.get();

		checkForErrors(res);

		const physRes = await physicalTypeController.getDropdown();
		checkForErrors(physRes);

		return { profile: profile.data, activityLevels: res.data, physicalTypes: physRes.data };
	} catch (err) {
		console.error('Unexpected error:', err);
		throw error(500, { message: 'Unexpected error.' });
	}
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as { input: string };
			const rawInput = JSON.parse(formData.input);
			rawInput.birthDate = new Date(rawInput.birthDate);
			const result = updateProfileSchema.safeParse(rawInput);

			if (!result.success) {
				return fail(400, { errors: parseZErrors(z.treeifyError(result.error)), data: formData });
			}

			const res = await userController.update({
				...result.data,
				user: { connect: { id: event.locals.user?.id ?? '' } },
				physicalType: { connect: { id: result.data.physicalTypeId } },
				activityLevel: { connect: { id: result.data.activityLevelId } },
				dateAdded: new Date()
			});

			if (res.status !== 200) {
				console.error('Failed to update profile:', res.message);
				return fail(400, {
					notification: createNotification('Failed to update profile!', 'danger')
				});
			}

			return {
				status: 200,
				notification: createNotification('Successfully updated profile!', 'success')
			};
		} catch (err) {
			console.error('Unexpected error:', err);
			return fail(500, { notification: createNotification('Failed to update profile!', 'danger') });
		}
	}
};
