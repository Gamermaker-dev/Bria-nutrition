import { foodController, usdaApi } from '$lib/server/controllers';
import type { FoodPaginatedSearch } from '$lib/types/usda/FoodPaginatedSearch';
import { checkForErrors, createNotification } from '$lib/util';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const params = Object.fromEntries(event.url.searchParams) as {
			search?: string;
			page?: string;
			tab?: string;
			submit?: string;
		};
		const search = params.search?.trim() ?? '';
		const rawPage = params.page?.trim() ?? '1';
		let page = parseInt(rawPage, 10);
		if (isNaN(page)) page = 1;
		const tab = params.tab?.trim() === 'custom' ? 'custom' : 'usda';
		const submit = params.submit === 'true';

		let results: FoodPaginatedSearch | undefined = undefined;

		if (tab === 'usda') {
			try {
				results = search !== '' ? await usdaApi.searchFoods(search, page) : undefined;
			} catch (err) {
				console.error('Error with USDA:', err);
				results = undefined;
				return {
					results,
					search,
					page,
					tab,
					submit,
					notification: createNotification(
						'Unable to reach USDA API. Please try again later',
						'warning'
					)
				};
			}
		} else {
			const custom = await foodController.getByUserId(event.locals.user.id, page, search);
			checkForErrors(custom);

			const count = await foodController.getTotalCustomFoods(event.locals.user.id, search);
			checkForErrors(count);

			results = {
				currentPage: page,
				pageList: [],
				totalHits: count.data ?? 0,
				totalPages: Math.ceil((count.data ?? 0) / 50),
				foods:
					custom.data?.map((m) => ({
						fdcId: m.id,
						description: m.name,
						dataType: 'Custom',
						publicationDate: m.dateAdded,
						foodNutrients: []
					})) ?? []
			};
		}

		return { results, search, page, tab, submit };
	} catch (err) {
		console.error('Food search failed:', err);
		throw error(500, { message: 'Whoops! Something unexpected occured!' });
	}
};
