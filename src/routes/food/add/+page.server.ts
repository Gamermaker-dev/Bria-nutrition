import { foodController, nutrientController, usdaApi } from '$lib/server/controllers';
import type { FoodInput } from '$lib/server/db/schema';
import { addFoodSchema } from '$lib/server/schemas';
import type { FoodById } from '$lib/types/usda/FoodById';
import { checkForErrors, createNotification, parseZErrors } from '$lib/util';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';
import z from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const params = Object.fromEntries(event.url.searchParams) as {
			fdcId?: string;
			customId?: string;
		};
		const fdcId = parseInt(params.fdcId?.trim() ?? '', 10);

		if (!isNaN(fdcId)) {
			const fdcFood = await usdaApi.getById(fdcId);

			return { food: fdcFood, type: 'fdc' };
		}

		const customId = parseInt(params.customId?.trim() ?? '', 10);
		if (!isNaN(customId)) {
			const res = await foodController.getCustomFoodById(customId);
			checkForErrors(res);

			if (res.data) {
				const customFood: FoodById = {
					brandOwner: 'Custom',
					dataType: 'Custom',
					customId: res.data.id,
					description: res.data.name,
					gtinUpc: 0,
					publicationDate: res.data.dateAdded,
					foodNutrients: res.data.foodNutrient.map((f) => ({
						name: f.nutrient.name,
						unitName: f.nutrient.unit,
						number: f.nutrient.fdcNumber.toString(),
						derivationCode: '',
						derivationDescription: '',
						amount: f.amount
					}))
				};

				return { food: customFood, type: 'custom' };
			}

			return error(400, { message: 'Bad request.' });
		}

		return error(400, { message: 'Bad request.' });
	} catch (err) {
		console.error('Unexpected error loading food add page:', err);
		const previousPage = event.request.headers.get('referer') || '/';
		const url = new URL(previousPage);
		if (url.searchParams.get('error') == undefined) url.searchParams.append('error', 'true');
		redirect(307, url);
	}
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as { input: string };
			const rawInput = JSON.parse(formData.input);
			rawInput.mealDate = new Date(rawInput.mealDate);
			const result = addFoodSchema.safeParse(rawInput);

			if (!result.success) {
				return fail(400, { errors: parseZErrors(z.treeifyError(result.error)), data: formData });
			}

			const id: number | undefined = result.data.id;
			const mealDate: Date = result.data.mealDate;
			const serving: number = parseFloat(result.data.serving);
			const fdcId: number | undefined = result.data.fdcId;
			const numbers: { number: number; amount: number }[] = result.data.nutrients.map((n) => ({
				number: parseInt(`${n.number}`.replaceAll(/\./g, ''), 10),
				amount: n.amount
			}));

			const nutrients = await nutrientController.getByFdcIds(numbers.map((n) => n.number));

			const input: FoodInput = {
				id,
				userId: event.locals.user.id ?? '',
				mealDate: mealDate,
				name: result.data.name,
				serving,
				fdcId,
				nutrients:
					nutrients.data?.map((n) => {
						const input = { nutrientId: n.id, amount: 0 };
						const cFood = numbers.find((fn) => fn.number == n.fdcNumber);
						if (cFood) {
							input.amount = cFood.amount;
						}

						return input;
					}) ?? []
			};

			const res = await foodController.create(input);
			if (res.status !== 200)
				return fail(400, {
					notification: createNotification(
						'Whoops! Something went wrong adding this to your meal!',
						'danger'
					)
				});

			return {
				status: 200,
				notification: createNotification('Successfully added food!', 'success')
			};
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Error occurred adding food:', err);
			return fail(500, {
				notification: createNotification('Unexpected error occurred!', 'danger')
			});
		}
	}
};
