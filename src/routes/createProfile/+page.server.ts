import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { validate } from './validate.server.ts';
import { userApi } from '$lib/server/db/user';

export const load: PageServerLoad = async (event) => {
	if (event.locals.profile) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData();

		const validation = validate(formData, event.locals.user.id);

		if (validation.errors.length === 0) {
			const results = await userApi.insertProfile(validation.input);
			console.log(results);

			return validation;
		}

		return fail(400, { errors: validation.errors });
	}
};
