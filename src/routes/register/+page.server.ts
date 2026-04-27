import { auth } from '$lib/server/auth';
import { registerSchema } from '$lib/server/schemas';
import { createNotification, parseZErrors } from '$lib/util';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
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

		if (event.locals.user) {
			return redirect(302, '/');
		}
		return {};
	} catch (err) {
		if (isRedirect(err) || err?.status === 503) throw err;
		console.error('Error occurred visiting register:', err);
		throw error(503, { message: 'Unable to load page. Please try again later.' });
	}
};

export const actions: Actions = {
	signUp: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as {
				email: string;
				name: string;
				password: string;
				confirmPassword: string;
			};
			const parse = registerSchema.safeParse(formData);

			if (!parse.success) {
				return fail(400, { errors: parseZErrors(z.treeifyError(parse.error)) });
			}

			const result = await auth.api.signUpEmail({
				body: {
					email: parse.data.email,
					password: parse.data.password,
					name: parse.data.name
				}
			});

			if (result.token) {
				return redirect(302, '/');
			}
			return fail(400, { notification: createNotification('Failed to register!', 'danger') });
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Unexpected error ocurred while signing up:', err);
			return fail(503, { notification: createNotification('Failed to register!', 'danger') });
		}
	}
};
