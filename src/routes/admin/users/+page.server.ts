import { userController } from '$lib/server/controllers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await userController.get();

	return { users };
};
