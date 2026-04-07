import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { meal, type Meal } from '$lib/server/db/schema';
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
}
