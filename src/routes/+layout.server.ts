import { error, isRedirect, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { NavbarItemProps } from '$lib/types/NavbarItemProps';

export const load: LayoutServerLoad = async (event) => {
	try {
		if (!event.locals.user && event.route.id !== '/login' && event.route.id !== '/register') {
			return redirect(302, '/login');
		}

		if (event.locals.user && !event.locals.profile && event.route.id !== '/profile/create') {
			return redirect(302, '/profile/create');
		}

		const navbar: NavbarItemProps[] = event.locals.user
			? [
					{ text: 'Home', href: '/' },
					{ text: 'Food', href: '/food' },
					{ text: 'Report', href: '/health' },
					{
						text: 'Settings',
						subItems: [
							{ text: 'Profile', href: '/profile' },
							{ text: 'Signout', action: '/login?/signOut' }
						]
					}
				]
			: [];

		return { user: event.locals.user, navbar, url: event.url, isMobile: event.locals.isMobile };
	} catch (err) {
		if (isRedirect(err)) throw err;

		throw error(500, { message: `${err}` });
	}
};
