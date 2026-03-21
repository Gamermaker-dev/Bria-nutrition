import { eq } from 'drizzle-orm';
import { db } from '..';
import { nutrient } from './schema';
import { returnOneRecord } from '../util';

const getNutrients = async () => {
	return await db.select().from(nutrient);
};

const getNutrientById = async (id: number) => {
	return returnOneRecord(await db.select().from(nutrient).where(eq(nutrient.id, id)));
};

const createNutrient = async (name: string) => {
	return await db.insert(nutrient).values({
		name
	});
};

const updateNutrient = async (id: number, name: string) => {
	return await db
		.update(nutrient)
		.set({
			name
		})
		.where(eq(nutrient.id, id));
};

const deleteNutrient = async (id: number) => {
	return await db.delete(nutrient).where(eq(nutrient.id, id));
};

export const nutrientApi = {
	getNutrients,
	getNutrientById,
	createNutrient,
	updateNutrient,
	deleteNutrient
};
