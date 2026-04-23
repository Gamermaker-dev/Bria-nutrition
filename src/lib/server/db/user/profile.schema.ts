import {
	bigint,
	datetime,
	decimal,
	foreignKey,
	index,
	int,
	mysqlTable,
	serial,
	varchar
} from 'drizzle-orm/mysql-core';
import { user } from '../auth.schema';
import type { InferInsertModel } from 'drizzle-orm/table';
import { activityLevel } from '../schema';
import { SQL, sql } from 'drizzle-orm';
import { physicalType } from '../physical_type/schema';
import type { Prisma } from '../../../../prisma/generated/prisma/client';

export const profile = mysqlTable(
	'profile',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => user.id),
		birthDate: datetime('birth_date').notNull(),
		physicalTypeId: bigint('physical_type_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => physicalType.id),
		heightInch: int('height_inch').notNull(),
		heightFeet: int('height_feet').notNull(),
		weight: decimal('weight', { scale: 1, precision: 4 }).notNull(),
		activityLevelId: bigint('activityLevelId', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => activityLevel.id),
		age: int('age').generatedAlwaysAs(
			(): SQL => sql`TIMESTAMPDIFF(YEAR, ${profile.birthDate}, CURDATE())`
		),
		nextProfileId: bigint('next_profile_id', { mode: 'number', unsigned: true }),
		dateAdded: datetime('date_added')
			.notNull()
			.$defaultFn(() => new Date()),
		dateUpdated: datetime('date_updated').$onUpdateFn(() => new Date()),
		dateDeleted: datetime('date_deleted')
	},
	(table) => [
		foreignKey({
			name: 'next_profile_foreignKey',
			columns: [table.nextProfileId],
			foreignColumns: [table.id]
		}),
		index('userId_indx').on(table.userId)
	]
);

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
export type ProfileInput = InferInsertModel<typeof profile>;
export type UserWithProfile = {
	user: {
		id: string;
		email: string;
	};
	profile: Prisma.profileSelect | null;
	physicalType: {
		id: number;
		name: string;
	};
	activityLevel: {
		id: number;
		name: string;
	};
};
