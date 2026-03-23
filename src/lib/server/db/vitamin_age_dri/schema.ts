import { boolean, float, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { nutrient } from '../nutrient/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const vitaminAgeDRI = mysqlTable('vitamin_age_dri', {
	id: int('id').primaryKey().autoincrement().unique(),
	nutrientId: int('nutrient_id')
		.notNull()
		.references(() => nutrient.id),
	minAge: int('min_age').notNull(),
	maxAge: int('max_age'),
	sex: varchar('sex', { length: 6 }).notNull(),
	isPregnant: boolean('is_pregnant')
		.notNull()
		.$default(() => false),
	isLactating: boolean('is_lactating')
		.notNull()
		.$default(() => false),
	amount: float('amount')
		.notNull()
		.$default(() => 0)
});

export type VitaminAgeDRI = InferSelectModel<typeof vitaminAgeDRI>;
export type VitaminAgeDRIInput = InferInsertModel<typeof vitaminAgeDRI>;
