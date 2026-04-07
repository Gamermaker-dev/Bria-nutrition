import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { datetime, mysqlTable, serial, text } from 'drizzle-orm/mysql-core';

export const role = mysqlTable('role', {
	id: serial('int').primaryKey(),
	name: text('name').notNull(),
	dateAdded: datetime('date_added')
		.notNull()
		.$default(() => new Date())
});

export type Role = InferSelectModel<typeof role>;
export type RoleInput = InferInsertModel<typeof role>;
