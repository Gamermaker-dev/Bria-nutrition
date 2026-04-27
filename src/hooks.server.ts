import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { userController } from '$lib/server/controllers';
import { prisma } from '$lib/server/db/prisma';
import { isRedirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		event.locals.dbLive = true;
	} catch (err) {
		console.error('Database is offline!', err);
		event.locals.dbLive = false;
	} finally {
		await prisma.$disconnect();
	}

	try {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
			event.locals.profile = (await userController.getById(event.locals.user.id)).data;
		}
	} catch (err) {
		console.error('Unexpected Better Auth exception:', err);
		event.locals.session = undefined;
		event.locals.user = undefined;
		event.locals.profile = undefined;
	}

	const userAgent = event.request.headers.get('User-Agent');
	event.locals.isMobile = userAgent !== null && userAgent.includes('Mobi');

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;

export const handleError: HandleServerError = (event) => {
	if (isRedirect(event.error)) {
		// do nothing
	} else {
		console.error(
			`An error occurred for ${event.event.route.id} and user ${event.event.locals.user?.id ?? 0}. The error is as folows:`,
			event.error
		);
	}
};
