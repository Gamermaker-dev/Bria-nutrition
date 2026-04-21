import { error, fail, isRedirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { foodController, nutrientController, usdaApi } from '$lib/server/controllers';
import type { FoodInput } from '$lib/server/db/schema';
import { checkForErrors, createActionError, formatDate } from '$lib/util';
import type { FoodById } from '$lib/types/usda/FoodById';
import { addFoodSchema } from '$lib/server/schemas';
import z from 'zod';

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
					foodNutrients: res.data.nutrients.map((f) => ({
						name: f.name,
						unitName: f.unit,
						number: f.fdcNumber.toString(),
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
		console.error(`${err}`);
		return error(500, { message: 'Unexpected error occured.' });
	}
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = Object.fromEntries(await event.request.formData()) as { input: string };
			const rawInput = JSON.parse(formData.input);
			rawInput.mealDate = new Date(rawInput.mealDate);
			const result = addFoodSchema.safeParse(rawInput);

            console.log(formData.input);

			if (!result.success) {
				const errors = z.treeifyError(result.error);
				console.error('Validation error:', errors);
				return fail(400, { errors, data: formData });
			}

			const mealDate: Date = result.data.mealDate;
			const serving: number = parseFloat(result.data.serving);
			const fdcId: number | undefined = result.data.fdcId;
			const numbers: { number: number; amount: number }[] = result.data.nutrients.map((n) => ({
				number: parseInt(`${n.number}`.replaceAll(/\./g, ''), 10),
				amount: n.amount
			}));

			const nutrients = await nutrientController.getByFdcIds(numbers.map((n) => n.number));

			const input: FoodInput = {
				userId: event.locals.user.id ?? '',
				mealDate: formatDate(mealDate),
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

			await foodController.create(input);

			return { status: 200, message: 'Successfully added food!' };
		} catch (err) {
			if (isRedirect(err)) throw err;
			console.error('Error occurred adding food:', err);
			return fail(500, createActionError({ add: ['Unexpected error occurred!'] }));
		}
	}
};
