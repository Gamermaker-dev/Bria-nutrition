import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const recommendation = {
	select: {
		id: true,
		labelId: true,
		minAge: true,
		maxAge: true,
		physicalTypeId: true,
		amount: true
	}
};

export type Recommendation = Prisma.recommendationGetPayload<typeof recommendation>;
export type RecommendationInput = Prisma.recommendationCreateInput;
