import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { userController } from '$lib/server/controllers';
import { isRedirect, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	try {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
			event.locals.profile = (await userController.getById(event.locals.user.id)).data;
		}

		const userAgent = event.request.headers.get('User-Agent');
		event.locals.isMobile = userAgent !== null && userAgent.includes('Mobi');

		return svelteKitHandler({ event, resolve, auth, building });
	} catch (err) {
		console.error('Unexpected Better Auth exception:', err);
		throw new Error();
	}
};

export const handle: Handle = handleBetterAuth;

export const handleError: HandleServerError = (event) => {
	if (isRedirect(event.error)) {
		// do nothing
	} else {
		console.error(
			`An error occurred for ${event.event.route.id} and user ${event.event.locals.user ?? 0}. The error is as folows:`,
			event.error
		);
		const previousPage = event.event.request.headers.get('referer') || '/';
		redirect(307, previousPage);
	}
};
