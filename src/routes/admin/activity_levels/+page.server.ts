import { activityLevelController } from '$lib/server/controllers';
import type { PageServerLoad } from './$types';
import { checkForErrors } from '$lib/util';

export const load: PageServerLoad = async () => {
	const res = await activityLevelController.get();

	checkForErrors(res);

	return { activityLevels: res.data };
};
