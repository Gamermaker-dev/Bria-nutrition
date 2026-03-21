import { and, eq, isNotNull } from 'drizzle-orm';
import { db } from '..';
import { returnOneRecord } from '../util';
import { meal } from './schema';

const getMeals = async () => {
	return await db.select().from(meal);
};

const getMealById = async (id: number) => {
	return returnOneRecord(await db.select().from(meal).where(eq(meal.id, id)));
};

const createMeal = async (name: string, userId: string) => {
	return await db.insert(meal).values({
		name,
		addedBy: userId,
		dateUpdated: null
	});
};

const updateMeal = async (id: number, name: string) => {
	return await db
		.update(meal)
		.set({
			name,
			dateUpdated: new Date()
		})
		.where(eq(meal.id, id));
};

const deleteMeal = async (id: number) => {
	return await db
		.update(meal)
		.set({
			dateDeleted: new Date()
		})
		.where(and(eq(meal.id, id), isNotNull(meal.dateDeleted)));
};

export const mealApi = {
	getMeals,
	getMealById,
	createMeal,
	updateMeal,
	deleteMeal
};
