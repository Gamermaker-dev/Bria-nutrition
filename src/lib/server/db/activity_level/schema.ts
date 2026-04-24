import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const activityLevel = {
	select: {
		id: true,
		name: true,
		description: true,
		mulitplier: true,
		dateAdded: true
	}
}

export type ActivityLevel = Prisma.activityLevelGetPayload<typeof activityLevel>;
export type ActivityLevelInput = Prisma.activityLevelCreateInput;
