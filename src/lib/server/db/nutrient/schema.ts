import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const nutrient = {
	select: {
		id: true,
		name: true,
		unit: true,
		fdcNutrientId: true,
		fdcNumber: true,
		dateAdded: true
	}
};

export type Nutrient = Prisma.nutrientGetPayload<typeof nutrient>;
export type NutrientInput = Prisma.nutrientCreateInput;
export interface NutrientWithAmount extends Nutrient {
	amount: number;
}
