import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { physicalType, type PhysicalType, type PhysicalTypeInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { BaseModelController } from '../db/base';

export class PhysicalTypeController extends BaseModelController<typeof physicalType> {
	constructor(tableName: string, table: typeof physicalType) {
		super(tableName, table);
	}

	public get = async (): Response<PhysicalType[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await db.select().from(this.TABLE);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number): Response<PhysicalType> => {
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

	public create = async (input: PhysicalTypeInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await db.insert(this.TABLE).values(input);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: PhysicalTypeInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await db
				.update(this.TABLE)
				.set({
					name: input.name
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
