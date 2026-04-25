import { auth } from '$lib/server/auth';
import { emailLoginSchema } from '$lib/server/schemas';
import { createNotification, parseZErrors } from '$lib/util';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import z from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		if (event.locals.user) {
			return redirect(302, '/');
		}
		return {};
	} catch (err) {
		throw error(500, { message: `${err}` });
	}
};

export const actions: Actions = {
	signInEmail: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as {
				email: string;
				password: string;
			};
			const parse = emailLoginSchema.safeParse(formData);

			if (!parse.success) {
				return fail(400, { errors: parseZErrors(z.treeifyError(parse.error)) });
			}

			const result = await auth.api.signInEmail({
				body: {
					email: parse.data.email,
					password: parse.data.password
				}
			});

			if (result.token) {
				return redirect(302, '/');
			}
			return fail(400, { notification: createNotification('Failed to sign-in!', 'danger') });
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Unexpected error occurred while logging in:', err);
			return fail(500, { notification: createNotification('Failed to sign-in!', 'danger') });
		}
	},
	signInSocial: async (event) => {
		try {
			const formData = await event.request.formData();
			const provider = formData.get('provider')?.toString() ?? 'github';
			const callbackURL = formData.get('callbackURL')?.toString() ?? '/';

			const result = await auth.api.signInSocial({
				body: {
					provider: provider as 'github',
					callbackURL
				}
			});

			if (result.url) {
				return redirect(302, result.url);
			}
			return fail(400, { notification: createNotification('Social sign-in failed', 'danger') });
		} catch (err) {
			if (isRedirect(err)) throw err;
			else {
				console.error('Unexpected error occurred while signing in through social:', err);
				return fail(500, { notification: createNotification('Failed to sign-in!', 'danger') });
			}
		}
	},
	signOut: async (event) => {
		try {
			await auth.api.signOut({
				headers: event.request.headers
			});
			return redirect(302, '/login');
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Unexpected error occurred signing out:', err);
			return fail(500, {
				notification: createNotification('Failed to sign-out!', 'danger')
			});
		}
	}
};
