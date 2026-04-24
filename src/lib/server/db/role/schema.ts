import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const role = {
	select: {
		id: true,
		name: true,
		dateAdded: true
	}
};

export type Role = Prisma.roleGetPayload<typeof role>;
export type RoleInput = Prisma.roleCreateInput;
