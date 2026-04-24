import {
	activityLevelController,
	physicalTypeController,
	userController
} from '$lib/server/controllers';
import type { ProfileInput } from '$lib/server/db/schema';
import { addProfileSchema } from '$lib/server/schemas';
import { checkForErrors, createActionError } from '$lib/util';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
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
				const errors = z.treeifyError(results.error);
				return fail(400, { errors, data: formData });
			}

			const input: ProfileInput = {
				birthDate: results.data.birthDate,
				physicalType: { connect: { id: results.data.physicalTypeId }},
				heightFeet: results.data.heightFeet,
				heightInch: results.data.heightInch,
				weight: results.data.weight,
				activityLevel: { connect: { id: results.data.activityLevelId }},
				user: { connect: { id: event.locals.user.id }},
				dateAdded: new Date(),
				dateUpdated: null
			};

			await userController.create(input);

			return { status: 200, message: 'Successfully created profile!' };
		} catch (err) {
			console.error('Error occurred creating profile:', err);
			throw fail(500, createActionError({ add: ['An unexpected error occurred.'] }));
		}
	}
};
