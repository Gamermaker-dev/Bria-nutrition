import { foodController, mealController, userController } from '$lib/server/controllers';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isDate } from 'util/types';
import { checkForErrors, createActionError } from '$lib/util';
import { deleteFoodSchema } from '$lib/server/schemas';
import z from 'zod';

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
			const formData = Object.fromEntries(await event.request.formData()) as { input: string };
			const rawInput = JSON.parse(formData.input);
			const result = deleteFoodSchema.safeParse(rawInput);

			if (!result.success) {
				const errors = z.treeifyError(result.error);
				return fail(400, { errors, data: formData })
			}

			const res = await foodController.delete(result.data.id, result.data.mealId);

			if (res.status !== 200) {
				console.error('Failed to delete food!', res.message);
				return fail(400, createActionError({ delete: ['Failed to delete food from meal!']}))
			}

			return { status: 200, message: 'Successfully deleted food!' };
		} catch (err: unknown) {
			console.error(`${err}`);
			throw fail(500, createActionError({ delete: ['Failed to delete food!'] }));
		}
	}
};
