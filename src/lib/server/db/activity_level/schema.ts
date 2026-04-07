import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { datetime, decimal, mysqlTable, serial, text } from 'drizzle-orm/mysql-core';

export const activityLevel = mysqlTable('activity_level', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description').notNull(),
    multiplier: decimal('multiplier', { precision: 4, scale: 3 }).$default(() => sql<number>`1`),
	dateAdded: datetime('date_added')
		.notNull()
		.$default(() => new Date())
});

export type ActivityLevel = InferSelectModel<typeof activityLevel>;
export type ActivityLevelInput = InferInsertModel<typeof activityLevel>;
