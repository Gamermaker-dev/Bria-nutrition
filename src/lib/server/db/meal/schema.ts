import { datetime, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { user } from "../auth.schema";

export const meal = mysqlTable('meal', {
    id: int('id').primaryKey().autoincrement().unique(),
    name: text('name').notNull(),
    addedBy: varchar('added_by', { length: 36 }).notNull().references(() => user.id),
    dateAdded: datetime('date_added').notNull().$defaultFn(() => new Date()),
    dateUpdated: datetime('date_updated').$onUpdateFn(() => new Date()),
    dateDeleted: datetime('date_deleted')
});