import { date, datetime, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { user } from '../auth.schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const meal = mysqlTable(
	'meal',
	{
		id: serial('id').primaryKey(),
		mealDate: date('meal_date').notNull(),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => user.id),
		dateAdded: datetime('date_added')
			.notNull()
			.$defaultFn(() => new Date()),
		dateUpdated: datetime('date_updated').$onUpdateFn(() => new Date()),
		dateDeleted: datetime('date_deleted')
	},
	(table) => [uniqueIndex('userMeal_indx').on(table.mealDate, table.userId)]
);

export type Meal = InferSelectModel<typeof meal>;
export type MealInput = InferInsertModel<typeof meal> & { userId: string; categoryId: number };
