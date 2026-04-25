import {
	activityLevelController,
	physicalTypeController,
	userController
} from '$lib/server/controllers';
import type { ProfileInput } from '$lib/server/db/schema';
import { addProfileSchema } from '$lib/server/schemas';
import { checkForErrors, createNotification, parseZErrors } from '$lib/util';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import z from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		if (event.locals.profile) {
			redirect(302, '/');
		}

		const res = await activityLevelController.get();

		checkForErrors(res);

		const physRes = await physicalTypeController.getDropdown();
		checkForErrors(physRes);

		return { activityLevels: res.data, physicalTypes: physRes.data };
	} catch (err) {
		if (isRedirect(err)) throw err;
		console.error('Error occurred loading create profile page:', err);
		throw error(500);
	}
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as { input: string };
			const rawInput = JSON.parse(formData.input);
			rawInput.birthDate = new Date(rawInput.birthDate);
			const results = addProfileSchema.safeParse(rawInput);

			if (!results.success) {
				return fail(400, { errors: parseZErrors(z.treeifyError(results.error)), data: formData });
			}

			const input: ProfileInput = {
				birthDate: results.data.birthDate,
				physicalType: { connect: { id: results.data.physicalTypeId } },
				heightFeet: results.data.heightFeet,
				heightInch: results.data.heightInch,
				weight: results.data.weight,
				activityLevel: { connect: { id: results.data.activityLevelId } },
				user: { connect: { id: event.locals.user.id } },
				dateAdded: new Date(),
				dateUpdated: null
			};

			await userController.create(input);

			return {
				status: 200,
				notification: createNotification('Successfully created profile!', 'success')
			};
		} catch (err) {
			console.error('Error occurred creating profile:', err);
			return fail(500, {
				notification: createNotification('An unexpected error occurred creating profile.', 'danger')
			});
		}
	}
};
