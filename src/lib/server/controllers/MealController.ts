import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { food, meal, mealFood, type Meal } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';

export class MealController extends BaseModelController<typeof meal> {
	constructor(tableName: string, table: typeof meal) {
		super(tableName, table);
	}

	public get = async (): Response<Meal[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await db.select().from(this.TABLE);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number): Response<Meal> => {
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

	public getMealForDateByUser = async (userId: string, mealDate: Date) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ForDateByUser`);
			const data = await db
				.select({
					mealId: meal.id,
					mealDate: meal.mealDate,
					foodId: food.id,
					foodName: food.name,
					amount: mealFood.amount
				})
				.from(this.TABLE)
				.innerJoin(mealFood, eq(this.TABLE.id, mealFood.mealId))
				.innerJoin(food, eq(mealFood.foodId, food.id))
				.where(and(eq(this.TABLE.userId, userId), eq(this.TABLE.mealDate, mealDate)));

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
