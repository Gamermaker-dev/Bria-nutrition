import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const meal = {
	select: {
		id: true,
		mealDate: true,
		userId: true,
		dateAdded: true,
		dateUpdated: true,
		dateDeleted: true
	}
}

export type Meal = Prisma.mealGetPayload<typeof meal>;
export type MealInput = Prisma.mealCreateInput;
