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
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm/table';
import { activityLevel, type ActivityLevel } from '../schema';
import { SQL, sql } from 'drizzle-orm';
import { physicalType, type PhysicalType } from '../physical_type/schema';

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

type ProfileSelectModel = InferSelectModel<typeof profile>;
type ProfileAugmented = ProfileSelectModel & {
	physicalType: PhysicalType;
	activityLevel: ActivityLevel;
};
export type Profile = ProfileAugmented;
export type ProfileInput = InferInsertModel<typeof profile>;
export type UserWithProfile = {
	userId: string;
	email: string;
	profile: Profile;
};
