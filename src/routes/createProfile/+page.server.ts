import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { validate } from './validate.server.ts';
import {
	activityLevelController,
	physicalTypeController,
	userController
} from '$lib/server/controllers';
import { checkForErrors } from '$lib/util';

export const load: PageServerLoad = async (event) => {
	if (event.locals.profile) {
		redirect(302, '/');
	}

	const res = await activityLevelController.get();

	checkForErrors(res);

	const physRes = await physicalTypeController.getDropdown();
	checkForErrors(physRes);

	return { activityLevels: res.data, physicalTypes: physRes.data };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const validation = validate(formData, event.locals.user.id);

		if (validation.errors.length === 0) {
			const results = await userController.create(validation.input);
			console.log(results);

			return { status: 200, input: validation };
		}

		return fail(400, { errors: validation.errors });
	}
};
