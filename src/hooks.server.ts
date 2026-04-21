import { isRedirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { userController } from '$lib/server/controllers';
import type { Profile } from '$lib/server/db/schema';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	try {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
			event.locals.profile = (await userController.getById(event.locals.user.id)).data as Profile;
		}

		const userAgent = event.request.headers.get('User-Agent');
		event.locals.isMobile = userAgent !== null && userAgent.includes('Mobi');

		return svelteKitHandler({ event, resolve, auth, building });
	} catch (err) {
		throw new Error(err);
	}
};

export const handle: Handle = handleBetterAuth;

export const handleError: HandleServerError = (event) => {
	if (isRedirect(event.error)) {
		// do nothing
	} else {
		console.error(
			`An error occurred for ${event.event.route.id} and user ${event.event.locals.user ?? 0}. The error is as folows:`, event.error
		);
	}
};
