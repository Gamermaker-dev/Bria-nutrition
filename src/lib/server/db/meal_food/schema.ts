import { bigint, float, index, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { meal } from '../meal/schema';
import { food } from '../food/schema';

export const mealFood = mysqlTable(
	'meal_food',
	{
		mealId: bigint('meal_id', { mode: 'number', unsigned: true }).references(() => meal.id),
		foodId: bigint('food_id', { mode: 'number', unsigned: true }).references(() => food.id),
		amount: float('amount')
			.notNull()
			.$default(() => 0)
	},
	(table) => [
		primaryKey({ name: 'meal_food_primary_key', columns: [table.mealId, table.foodId] }),
		index('mealId_indx').on(table.mealId)
	]
);
