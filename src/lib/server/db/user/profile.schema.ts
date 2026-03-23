import { datetime, decimal, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { user } from '../auth.schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm/table';

export const profile = mysqlTable('profile', {
	id: int('id').primaryKey().autoincrement().unique(),
	userId: varchar('user_id', { length: 36 })
		.notNull()
		.references(() => user.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	age: int('age').notNull(),
	sex: varchar('sex', { length: 1 }).notNull(),
	heightInch: int('height_inch').notNull(),
	heightFeet: int('height_feet').notNull(),
	weight: decimal('weight', { scale: 1, precision: 4 }).notNull(),
	dateAdded: datetime('date_added')
		.notNull()
		.$defaultFn(() => new Date()),
	dateUpdated: datetime('date_updated').$onUpdateFn(() => new Date()),
	dateDeleted: datetime('date_deleted')
});

export type Profile = InferSelectModel<typeof profile>;
export type ProfileInput = InferInsertModel<typeof profile>;
