import { datetime, int, text } from 'drizzle-orm/mysql-core';
import { mysqlTable } from 'drizzle-orm/mysql-core/table';

export const ingredient = mysqlTable('ingredient', {
	id: int('id').primaryKey().autoincrement().unique(),
	name: text('name').notNull(),
	dateAdded: datetime('date_added')
		.notNull()
		.$defaultFn(() => new Date())
});
