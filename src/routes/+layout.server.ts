import type { NavbarItemProps } from '$lib/types/NavbarItemProps';
import { error, isRedirect, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

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

		return {
			user: event.locals.user,
			navbar,
			url: event.url,
			isMobile: event.locals.isMobile,
			displayError: event.url.searchParams.get('error') === 'true'
		};
	} catch (err) {
		if (isRedirect(err)) throw err;

		console.error('Unexpected error in layout:', err);
		throw error(503, { message: 'Unable to load app. Please try again later.' });
	}
};
