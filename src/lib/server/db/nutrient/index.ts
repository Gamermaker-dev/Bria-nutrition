import { eq } from 'drizzle-orm';
import { db } from '..';
import { nutrient, type NutrientInput } from './schema';
import { returnOneRecord } from '../util';

const getNutrients = async () => {
	return await db.select().from(nutrient);
};

const getNutrientById = async (id: number) => {
	return returnOneRecord(await db.select().from(nutrient).where(eq(nutrient.id, id)));
};

const getNutrientDropdown = async () => {
	const query = db
		.select({
			label: nutrient.name,
			value: nutrient.id
		})
		.from(nutrient);

	console.log(query.getSQL());

	return await query;
};

const createNutrient = async (input: NutrientInput) => {
	return await db.insert(nutrient).values({
		name: input.name
	});
};

const updateNutrient = async (input: NutrientInput) => {
	return await db
		.update(nutrient)
		.set({
			name: input.name
		})
		.where(eq(nutrient.id, input.id as number));
};

const deleteNutrient = async (id: number) => {
	return await db.delete(nutrient).where(eq(nutrient.id, id));
};

export const nutrientApi = {
	getNutrients,
	getNutrientById,
	getNutrientDropdown,
	createNutrient,
	updateNutrient,
	deleteNutrient
};
