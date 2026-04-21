import { foodController, mealController, userController } from '$lib/server/controllers';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isDate } from 'util/types';
import { checkForErrors, createActionError } from '$lib/util';

export const load: PageServerLoad = async (event) => {
	try {
		if (event.locals.user) {
			const rawMealDate = event.url.searchParams.get('mealDate');

			const TODAY = new Date();
			let mealDate = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
			if (rawMealDate != null) {
				const decodedMealDate = new Date(decodeURI(rawMealDate));

				if (isDate(decodedMealDate)) mealDate = decodedMealDate;
			}

			const dashboard = await userController.getDashboard(event.locals.user.id, mealDate);
			checkForErrors(dashboard);

			const meal = await mealController.getMealForDateByUser(event.locals.user.id, mealDate);
			checkForErrors(meal);

			return { dashboard: dashboard.data, meal: meal.data, mealDate };
		}

		throw error(500, 'User required.');
	} catch (err) {
		throw error(500, { message: `${err}` });
	}
};

export const actions: Actions = {
	deleteFoodFromMeal: async (event) => {
		try {
			const formData = await event.request.formData();

			let foodId: number = 0;
			let mealId: number = 0;

			const rawFoodId = formData.get('foodId');
			console.log(rawFoodId);
			if (rawFoodId) {
				foodId = parseInt(rawFoodId.toString(), 10);
				if (isNaN(foodId))
					throw fail(400, createActionError({ delete: ['Failed to delete food!'] }));
			}

			const rawMealId = formData.get('mealId');
			console.log(rawMealId);
			if (rawMealId) {
				mealId = parseInt(rawMealId.toString(), 10);
				if (isNaN(mealId))
					throw fail(400, createActionError({ delete: ['Failed to delete food!'] }));
			}

			await foodController.delete(foodId, mealId);

			return { status: 200, message: 'Successfully deleted food!' };
		} catch (err: unknown) {
			console.error(`${err}`);
			throw fail(500, createActionError({ delete: ['Failed to delete food!'] }));
		}
	}
};
