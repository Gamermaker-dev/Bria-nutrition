import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { NavbarItemProps } from '$lib/components/bulma/NavbarItem.svelte';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user && event.route.id !== '/login') {
		return redirect(302, '/login');
	}

	const navbar: NavbarItemProps[] = event.locals.user
		? [
				{ text: 'Home', isActive: event.route.id === '/', href: '/' },
				{ text: 'Admin', isActive: event.route.id?.startsWith('/admin'), href: '/admin' }
			]
		: [];

	return { user: event.locals.user, navbar };
};
