import type { Nutrient, NutrientWithAmount } from '../schema';
import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const food = {
	select :
	{
		id: true,
		name: true,
		fdcId: true,
		userId: true,
		dateAdded: true
	}
};

export type Food = Prisma.foodGetPayload<typeof food>;
export interface FoodWithNutrients extends Food {
	nutrients: Nutrient[];
}
export type _FoodInput = Prisma.foodCreateInput;
export type FoodInput = {
	id?: number;
	name: string;
	fdcId: number;
	serving: number;
	nutrients: { nutrientId: number; amount: number }[];
	mealDate: Date | string;
	userId: string;
};
export interface CustomFood extends Food {
	nutrients: NutrientWithAmount[];
}
