import { bigint, float, index, int, mysqlTable, serial } from 'drizzle-orm/mysql-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { physicalType } from '../physical_type/schema';
import { label } from '../schema';

export const recommendation = mysqlTable(
	'recommendation',
	{
		id: serial('id').primaryKey(),
		labelId: bigint('label_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => label.id),
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
		index('labelId_indx').on(table.labelId),
		index('physicalTypeId_indx').on(table.physicalTypeId)
	]
);

export type Recommendation = InferSelectModel<typeof recommendation>;
export type RecommendationInput = InferInsertModel<typeof recommendation>;
