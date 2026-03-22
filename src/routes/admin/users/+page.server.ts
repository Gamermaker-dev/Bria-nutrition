import { userApi } from '$lib/server/db/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await userApi.getUsers();

	return { users };
};
