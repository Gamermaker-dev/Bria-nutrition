import { bigint, float, index, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { food } from '../food/schema';
import { nutrient } from '../nutrient/schema';

export const foodNutrient = mysqlTable(
	'food_nutrient',
	{
		foodId: bigint('food_id', { mode: 'number', unsigned: true }).references(() => food.id),
		nutrientId: bigint('nutrient_id', { mode: 'number', unsigned: true }).references(
			() => nutrient.id
		),
		amount: float('amount')
			.notNull()
			.$default(() => 0)
	},
	(table) => [
		primaryKey({ name: 'food_nutrient_primary_key', columns: [table.foodId, table.nutrientId] }),
		index('foodId_indx').on(table.foodId)
	]
);

export const fdcNutrient = mysqlTable(
	'fdc_nutrient',
	{
		fdcId: bigint('fdc_id', { mode: 'number', unsigned: true }),
		nutrientId: bigint('nutrient_id', { mode: 'number', unsigned: true }),
		amount: float('amount')
			.notNull()
			.$default(() => 0)
	},
	(table) => [
		primaryKey({ name: 'fdc_nutrient_primary_key', columns: [table.fdcId, table.nutrientId] }),
		index('fdcId_indx').on(table.fdcId)
	]
);
