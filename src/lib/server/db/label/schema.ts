import type { InferSelectModel } from "drizzle-orm";
import { datetime, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const label = mysqlTable('label', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    dateAdded: datetime('date_added').notNull().$default(() => new Date())
});

export type Label = InferSelectModel<typeof label>;