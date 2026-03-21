import { eq } from 'drizzle-orm';
import { db } from '..';
import { ingredient } from './schema';
import { returnOneRecord } from '../util';

const getIngredients = async () => {
    return await db.select().from(ingredient);
};

const getIngredientById = async (id: number) => {
    return returnOneRecord(await db.select().from(ingredient).where(eq(ingredient.id, id)));
};

const createIngredient = async (name: string) => {
    return await db.insert(ingredient).values({
        name
    });
};

const updateIngredient = async (id: number, name: string) => {
    return await db
        .update(ingredient)
        .set({
            name
        })
        .where(eq(ingredient.id, id));
};

const deleteIngredient = async (id: number) => {
    return await db.delete(ingredient).where(eq(ingredient.id, id));
};

export const ingredientApi = {
    getIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
    deleteIngredient
};
