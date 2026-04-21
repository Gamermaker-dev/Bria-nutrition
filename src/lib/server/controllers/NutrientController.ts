import { eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { nutrient, type Nutrient, type NutrientInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

export class NutrientController extends BaseModelController<typeof nutrient> {
	constructor(tableName: string, table: typeof nutrient) {
		super(tableName, table);
	}

	public get = async (): Response<Nutrient[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await db.select().from(this.TABLE);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number): Response<Nutrient> => {
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

	public getByFdcIds = async (fdcIds: number[]): Response<Nutrient[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ByFdcIds`);

			const data = await db.select().from(this.TABLE).where(inArray(this.TABLE.fdcNumber, fdcIds));

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

	public create = async (input: NutrientInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await db.insert(this.TABLE).values(input);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public import = async (input: NutrientInput[]): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await db.insert(this.TABLE).values(input);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: NutrientInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await db
				.update(this.TABLE)
				.set({
					name: input.name,
					fdcNumber: input.fdcNumber,
					unit: input.unit
				})
				.where(eq(this.TABLE.id, input.id as number));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await db.delete(this.TABLE).where(eq(this.TABLE.id, id));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
