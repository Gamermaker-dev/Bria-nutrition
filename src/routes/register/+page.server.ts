import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { createActionError } from '$lib/util';

export const load: PageServerLoad = async (event) => {
	try {
		if (event.locals.user) {
			return redirect(302, '/');
		}
		return {};
	} catch (err) {
		console.error('Error occurred visiting register:', err);
	}
};

export const actions: Actions = {
	signUp: async (event) => {
		try {
			const formData = await event.request.formData();

			const result = await auth.api.signUpEmail({
				body: {
					email: formData.get('email')?.toString() ?? '',
					password: formData.get('password')?.toString() ?? '',
					name: formData.get('name')?.toString() ?? ''
				}
			});

			if (result.token) {
				return redirect(302, '/');
			}
			return fail(400, createActionError({ register: ['Failed to register!'] }));
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Unexpected error ocurred while signing up:', err);
			throw fail(500, createActionError({ register: ['Failed to register!'] }));
		}
	}
};
