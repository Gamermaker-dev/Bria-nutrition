import type { Decimal, DecimalJsLike } from '@prisma/client/runtime/client';
import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const profileWithUser = {
	select: {
		id: true,
		userId: true,
		user: { select: { id: true, email: true } },
		birthDate: true,
		physicalTypeId: true,
		physicalType: { select: { id: true, name: true } },
		heightFeet: true,
		heightInch: true,
		weight: true,
		age: true,
		activityLevelId: true,
		activityLevel: { select: { id: true, name: true } }
	}
};
export type Profile = Prisma.profileGetPayload<typeof profileWithUser>;
export type ProfileInput = Prisma.profileCreateInput;
export type _ProfileInput = {
	id?: number | bigint | undefined;
	birthDate: string | Date;
	heightInch: number;
	heightFeet: number;
	weight: string | number | Decimal | DecimalJsLike;
	age?: number | null;
	nextProfileId?: number | bigint | undefined;
	activityLevelId: number | bigint;
	physicalTypeId: number | bigint;
	userId: string;
	dateAdded: Date | string;
	dateUpdated?: Date | string | null;
	dateDeleted?: Date | string | null;
};
export type UserWithProfile = {
	user: {
		id: string;
		email: string;
	};
	profile: Profile | null;
	physicalType: {
		id: number;
		name: string;
	};
	activityLevel: {
		id: number;
		name: string;
	};
};
