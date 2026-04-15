import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { bigint, datetime, int, serial, text } from 'drizzle-orm/mysql-core';
import { mysqlTable } from 'drizzle-orm/mysql-core/table';

export const nutrient = mysqlTable('nutrient', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	unit: text('unit').notNull(),
	fdcNutrientId: bigint('fdc_nutrient_id', { mode: 'number', unsigned: true }).notNull(),
	fdcNumber: int('fdc_number').notNull(),
	dateAdded: datetime('date_added')
		.notNull()
		.$defaultFn(() => new Date())
});

export type Nutrient = InferSelectModel<typeof nutrient>;
export type NutrientInput = InferInsertModel<typeof nutrient>;
