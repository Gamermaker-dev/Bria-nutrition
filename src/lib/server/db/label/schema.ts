import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const label = {
	select: {
		id: true,
		name: true,
		dateAdded: true
	}
};

export type Label = Prisma.labelGetPayload<typeof label>;
export type LabelInput = Prisma.labelCreateInput;
