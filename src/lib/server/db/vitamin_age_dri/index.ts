import { eq } from 'drizzle-orm';
import { db } from '..';
import { vitaminAgeDRI, type VitaminAgeDRIInput } from './schema';
import { error } from '@sveltejs/kit';

const getAll = async () => {
	return await db.select().from(vitaminAgeDRI);
};

const getById = async (id: number) => {
	const query = db.select().from(vitaminAgeDRI).where(eq(vitaminAgeDRI.id, id));

	console.log(query.getSQL());

	const results = await query;

	if (results.length > 1)
		return error(500, { message: 'More than one record in VitaminAgeDRI.getById' });

	return results.length === 1 ? results[0] : undefined;
};

const getByNutrientId = async (nutrientId: number) => {
	const query = db.select().from(vitaminAgeDRI).where(eq(vitaminAgeDRI.nutrientId, nutrientId));

	console.log(query.getSQL());

	return await query;
};

const bulkCreate = async (inputs: VitaminAgeDRIInput[]) => {
	const query = db.insert(vitaminAgeDRI).values(inputs);

	console.log(query.getSQL());

	return await query;
};

export const vitaminAgeDRIApi = {
	getAll,
	getById,
	getByNutrientId,
	bulkCreate
};
