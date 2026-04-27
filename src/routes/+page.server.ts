import { foodController, mealController, userController } from '$lib/server/controllers';
import { deleteFoodSchema } from '$lib/server/schemas';
import { checkForErrors, createNotification, parseZErrors } from '$lib/util';
import { error, fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { isDate } from 'util/types';
import z from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		if (event.locals.user) {
			const rawMealDate = event.url.searchParams.get('mealDate');

			let mealDate = dayjs.utc().toDate();
			if (rawMealDate != null) {
				const decodedMealDate = dayjs.utc(decodeURI(rawMealDate)).toDate();

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
				return fail(400, { errors: parseZErrors(z.treeifyError(result.error)), data: formData });
			}

			const res = await foodController.delete(result.data.id, result.data.mealId);

			if (res.status !== 200) {
				console.error('Failed to delete food!', res.message);
				return fail(400, {
					notification: createNotification('Failed to delete food from meal!', 'danger')
				});
			}

			return {
				status: 200,
				notification: createNotification('Successfully deleted food!', 'success')
			};
		} catch (err) {
			console.error('Failed to delete food from meal:', err);
			return fail(500, {
				notification: createNotification('Failed to delete food from meal!', 'danger')
			});
		}
	}
};
