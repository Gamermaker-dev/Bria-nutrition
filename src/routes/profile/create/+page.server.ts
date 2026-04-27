import {
	activityLevelController,
	physicalTypeController,
	userController
} from '$lib/server/controllers';
import type { ProfileInput } from '$lib/server/db/schema';
import { addProfileSchema } from '$lib/server/schemas';
import { checkForErrors, createNotification, parseZErrors } from '$lib/util';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import z from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		if (!event.locals.dbLive) {
			throw error(503, {
				message:
					'Unable to load Bria Nutrition. We apologize for the error. Please try again later.'
			});
		}

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
		if (err?.status === 503) throw err;
		throw error(503, { message: 'Unable to load page. Please try again later.'});
	}
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as { input: string };
			const rawInput = JSON.parse(formData.input);
			rawInput.birthDate = dayjs.utc(rawInput.birthDate).toDate();
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
				dateAdded: dayjs.utc().toDate(),
				dateUpdated: null
			};

			const res = await userController.create(input);

			if (res.status !== 200)
				return fail(400, {
					notfication: createNotification('Failed to create profile!', 'danger')
				});

			return {
				status: 200,
				notification: createNotification('Successfully created profile!', 'success')
			};
		} catch (err) {
			console.error('Error occurred creating profile:', err);
			return fail(503, {
				notification: createNotification('An unexpected error occurred creating profile.', 'danger')
			});
		}
	}
};
