import { nutrientApi } from '$lib/server/db/nutrient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const nutrients = await nutrientApi.getNutrients();

	return { nutrients };
};
