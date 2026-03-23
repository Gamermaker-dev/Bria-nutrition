import {
	mysqlTable,
	int,
	text,
	datetime,
	decimal,
	float,
	varchar
} from 'drizzle-orm/mysql-core';
import { user } from './auth.schema';
import { nutrient } from './nutrient/schema';
import { ingredient } from './ingredient/schema';
import { meal } from './meal/schema';

export const recommendation = mysqlTable('recommendation', {
	id: int('id').primaryKey().autoincrement().unique(),
	userId: varchar('user_id', { length: 36 })
		.notNull()
		.references(() => user.id),
	calories: int('calories').notNull(),
	carbs: int('carbs').notNull(),
	protein: int('protein').notNull(),
	fat: int('fat').notNull(),
	water: decimal('water', { scale: 1, precision: 2 }).notNull(),
	dateAdded: datetime('date_added')
		.notNull()
		.$defaultFn(() => new Date()),
	dateUpdated: datetime('date_updated').$onUpdateFn(() => new Date()),
	dateDeleted: datetime('date_deleted')
});

export const recommendationVitamin = mysqlTable('recommendation_vitamin', {
	id: int('id').primaryKey().autoincrement().unique(),
	userId: varchar('user_id', { length: 36 })
		.notNull()
		.references(() => user.id),
	vitaminA: int('vitamin_a').notNull(),
	vitaminC: int('vitamin_c').notNull(),
	vitaminD: int('vitamin_d').notNull(),
	vitaminB6: decimal('vitamin_b6', { scale: 1, precision: 2 }).notNull(),
	vitaminE: int('vitamin_e').notNull(),
	vitaminK: int('vitamin_k').notNull(),
	thiaman: decimal('thiaman', { scale: 1, precision: 2 }).notNull(),
	vitaminB12: decimal('vitamin_b12', { scale: 1, precision: 3 }).notNull(),
	riboflavin: decimal('riboflavin', { scale: 1, precision: 2 }).notNull(),
	folate: int('folate').notNull(),
	niacin: int('niacin').notNull(),
	choline: decimal('choline', { scale: 2, precision: 3 }),
	pantothenicAcid: int('pantothenic_acid').notNull(),
	biotin: int('biotin').notNull(),
	dateAdded: datetime('date_added')
		.notNull()
		.$defaultFn(() => new Date()),
	dateUpdated: datetime('date_updated').$onUpdateFn(() => new Date()),
	dateDeleted: datetime('date_deleted')
});

export const mealCategory = mysqlTable('meal_category', {
	id: int('id').primaryKey().autoincrement().unique(),
	name: text('name').notNull()
});

export const userMeal = mysqlTable('user_meal', {
	userId: varchar('user_id', { length: 36 })
		.primaryKey()
		.references(() => user.id),
	mealId: int('meal_id')
		.primaryKey()
		.references(() => meal.id),
	categoryId: int('category_id')
		.notNull()
		.references(() => mealCategory.id),
	dateAdded: datetime('date_added')
		.notNull()
		.$defaultFn(() => new Date())
});

export const mealIngredient = mysqlTable('meal_ingredient', {
	mealId: int('meal_id')
		.primaryKey()
		.references(() => meal.id),
	ingredientId: int('ingredient_id').references(() => ingredient.id),
	amount: float('amount')
		.notNull()
		.$default(() => 0)
});

export const ingredientNutrient = mysqlTable('ingredient_nutrient', {
	ingredientId: int('ingredient_id')
		.primaryKey()
		.references(() => ingredient.id),
	nutrientId: int('nutrient_id')
		.primaryKey()
		.references(() => nutrient.id),
	amount: float('amount')
		.notNull()
		.$default(() => 0)
});

export * from './auth.schema';
export * from './user/profile.schema.ts';
export * from './nutrient/schema';
export * from './ingredient/schema';
export * from './meal/schema';
export * from './vitamin_age_dri/schema';
