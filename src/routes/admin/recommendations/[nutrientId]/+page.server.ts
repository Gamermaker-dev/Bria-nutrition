import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { nutrientRecommendationsApi } from '$lib/server/db/nutrient_recommendations';

export const load: PageServerLoad = async (event) => {
	const nutrientId: number = parseInt(event.params.nutrientId, 10);

	if (isNaN(nutrientId)) return error(500, { message: 'Invalid nutrient.' });

	const reccommendations = await nutrientRecommendationsApi.getByNutrientId(nutrientId);

	return { reccommendations };
};
