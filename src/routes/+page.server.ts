import { userController } from '$lib/server/controllers';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		if (event.locals.user) {
			const dashboard = await userController.getDashboard(event.locals.user.id);
			// const test = await usdaApi.getFoodList(['Branded', 'Foundation', 'SR Legacy', 'Survey (FNDDS)'], 1);

			return { dashboard: dashboard.data };
		}

		throw error(500, 'User required.');
	} catch (err) {
		throw error(500, { message: `${err}` });
	}
};
