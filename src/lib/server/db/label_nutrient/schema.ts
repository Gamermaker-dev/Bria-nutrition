import { bigint, index, mysqlTable } from 'drizzle-orm/mysql-core';
import { nutrient, label } from '../schema';
import type { InferSelectModel } from 'drizzle-orm';

export const labelNutrient = mysqlTable(
	'label_nutrient',
	{
		labelId: bigint('label_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => label.id),
		nutrientId: bigint('nutrient_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => nutrient.id)
	},
	(table) => [index('labelId_indx').on(table.labelId)]
);

export type LabelNutrient = InferSelectModel<typeof labelNutrient>;
