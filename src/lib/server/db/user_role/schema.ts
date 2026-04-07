import { bigint, datetime, index, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';
import { role } from '../role/schema';
import { user } from '../auth.schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const userRole = mysqlTable(
	'user_role',
	{
		userId: varchar('userId', { length: 36 })
			.notNull()
			.references(() => user.id),
		roleId: bigint('role_id', { mode: 'number', unsigned: true })
			.notNull()
			.references(() => role.id),
		dateAdded: datetime('date_added')
			.notNull()
			.$default(() => new Date())
	},
	(table) => [
		primaryKey({ name: 'user_role_primary_key', columns: [table.userId, table.roleId] }),
		index('user_role_usrId_indx').on(table.userId),
		index('user_role_roleId_indx').on(table.roleId)
	]
);

export type UserRole = InferSelectModel<typeof userRole>;
export type UserRoleInput = InferInsertModel<typeof userRole>;
