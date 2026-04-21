import type { FoodNutrient } from './FoodNutrient';

export type FoodById = {
	fdcId?: number;
    customId?: number,
	description: string;
	dataType: string;
	publicationDate: Date | string;
	brandOwner: string;
	gtinUpc: number;
	foodNutrients: FoodNutrient[];
};
