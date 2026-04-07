import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	food,
	foodNutrient,
	meal,
	mealFood,
	type Food,
	type FoodInput
} from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { error } from '@sveltejs/kit';

export class FoodController extends BaseModelController<typeof food> {
	constructor(tableName: string, table: typeof food) {
		super(tableName, table);
	}

	public get = async (): Response<Food[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await db.select().from(this.TABLE);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number): Response<Food> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = this.returnOneRecord(
				await db.select().from(this.TABLE).where(eq(this.TABLE.id, id))
			);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDropdown = async (): Response<{ label: string; value: number }[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}Dropdown`);

			const data = await db
				.select({
					label: this.TABLE.name,
					value: this.TABLE.id
				})
				.from(this.TABLE);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: FoodInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);

			const results = await db.transaction(async (tx) => {
				let mealId: number = 0;
				let foodId: number = 0;

				const existingMeals = await tx
					.select()
					.from(meal)
					.where(
						and(eq(meal.userId, input.userId), eq(meal.mealDate, sql<Date>`${input.mealDate}`))
					);

				if (existingMeals.length === 0) {
					const newMeal = await tx
						.insert(meal)
						.values({
							mealDate: new Date(input.mealDate),
							userId: input.userId
						})
						.$returningId();

					if (newMeal.length === 0) {
						tx.rollback();
						return { success: false, error: 'New meal for user could not be created.' };
					}

					mealId = newMeal[0].id;
				} else {
					mealId = existingMeals[0].id;
				}

				// check if we've already added this
				let existingFood: Food[] = [];
				if (input.fdcId) {
					existingFood = await tx
						.select()
						.from(this.TABLE)
						.where(eq(this.TABLE.fdcId, input.fdcId));
				}

				if (existingFood.length === 0) {
					const newFood = await tx
						.insert(this.TABLE)
						.values({
							name: input.name,
							fdcId: input.fdcId
						})
						.$returningId();

					if (newFood.length === 0) {
						tx.rollback();
						return { success: false, error: 'New food could not be created.' };
					}

					foodId = newFood[0].id;

					// save food nutrient combos
					const newNutrients = await tx
						.insert(foodNutrient)
						.values(
							input.nutrients.map((n) => ({ foodId, nutrientId: n.nutrientId, amount: n.amount }))
						);

					if (newNutrients[0].affectedRows < input.nutrients.length) {
						tx.rollback();
						return { success: false, error: 'FoodNutrient combo could not be saved!' };
					}
				} else {
					foodId = existingFood[0].id;
				}

				// finally, save meal food combo
				const newMealFood = await tx
					.insert(mealFood)
					.values({ mealId, foodId, amount: input.serving });

				if (newMealFood[0].affectedRows === 0) {
					tx.rollback();
					return { status: 400, error: 'Food could not be saved to meal.' };
				}

				return { success: true, data: newMealFood };
			});

			if (!results.success) throw error(400, { message: results.error ?? '' });
			return this.success(results.data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (foodId: number, mealId: number): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const results = await db.transaction(async (tx) => {
				const food = this.returnOneRecord(
					await db.select().from(this.TABLE).where(eq(this.TABLE.id, foodId))
				);
				// First -- delete the mealFood combos
				const deletedMealFoods = await tx.delete(mealFood).where(eq(mealFood.foodId, food.id));

				if (deletedMealFoods[0].affectedRows === 0) {
					tx.rollback();
					return { success: false, error: 'Failed to delete foods from meal.' };
				}

				// Next, check if meal contains any more food
				const remainingMeals = await tx.select().from(mealFood).where(eq(mealFood.mealId, mealId));

				if (remainingMeals.length === 0) {
					// delete the meal
					const deletedMeal = await tx.delete(meal).where(eq(meal.id, mealId));

					if (deletedMeal[0].affectedRows === 0) {
						tx.rollback();
						return { success: false, error: 'Failed to delete empty meal' };
					}
				}

				return { success: true, data: deletedMealFoods, error: '' };
			});

			if (!results?.success) throw error(400, { message: results?.error ?? '' });
			return this.success(results.data);
		} catch (err) {
			return this.error(err);
		}
	};
}
