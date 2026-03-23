import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { vitaminAgeDRIApi } from '$lib/server/db/vitamin_age_dri';

export const load: PageServerLoad = async (event) => {
	const nutrientId: number = parseInt(event.params.nutrientId, 10);

	if (isNaN(nutrientId)) return error(500, { message: 'Invalid nutrient.' });

	const reccommendations = await vitaminAgeDRIApi.getByNutrientId(nutrientId);

	return { reccommendations };
};
