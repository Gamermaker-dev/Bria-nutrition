import { type InferSelectModel } from 'drizzle-orm';
import { datetime, index, int, serial, text, varchar } from 'drizzle-orm/mysql-core';
import { mysqlTable } from 'drizzle-orm/mysql-core/table';
import type { Nutrient } from '../schema';

export const food = mysqlTable(
	'food',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		fdcId: int('fdcId'),
		userId: varchar('user_id', { length: 36 }),
		dateAdded: datetime('date_added')
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [index('userId_indx').on(table.userId)]
);

export type Food = InferSelectModel<typeof food>;
export type FoodWithNutrients = Food & { nutrients: Nutrient[] };
export type FoodInput = {
	id?: number;
	name: string;
	fdcId: number;
	serving: number;
	nutrients: { nutrientId: number; amount: number }[];
	mealDate: string;
	userId: string;
};
