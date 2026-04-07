import { bigint, float, index, int, mysqlTable, serial } from 'drizzle-orm/mysql-core';
import { nutrient } from '../nutrient/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { physicalType } from '../physical_type/schema';

export const recommendation = mysqlTable(
	'recommendation',
	{
		id: serial('id').primaryKey(),
		nutrientId: bigint('nutrient_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => nutrient.id),
		minAge: int('min_age').notNull(),
		maxAge: int('max_age'),
		physicalTypeId: bigint('physical_type_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => physicalType.id),
		amount: float('amount')
			.notNull()
			.$default(() => 0)
	},
	(table) => [
		index('nutrientId_indx').on(table.nutrientId),
		index('physicalTypeId_indx').on(table.physicalTypeId)
	]
);

export type Recommendation = InferSelectModel<typeof recommendation>;
export type RecommendationInput = InferInsertModel<typeof recommendation>;
