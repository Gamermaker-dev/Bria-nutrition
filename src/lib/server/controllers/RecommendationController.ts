import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { recommendation, type Recommendation, type RecommendationInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

export class RecommendationsController extends BaseModelController<typeof recommendation> {
	constructor(tableName: string, table: typeof recommendation) {
		super(tableName, table);
	}

	public get = async (): Response<Recommendation[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);
			const data = await db.select().from(this.TABLE);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number): Response<Recommendation> => {
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

	public getByNutrientId = async (nutrientId: number): Response<Recommendation[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ByNutrientId`);
			const data = await db.select().from(this.TABLE).where(eq(this.TABLE.nutrientId, nutrientId));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: RecommendationInput[]): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await db.insert(this.TABLE).values(input);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (nutrientId: number): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await db.delete(this.TABLE).where(eq(this.TABLE.nutrientId, nutrientId));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
