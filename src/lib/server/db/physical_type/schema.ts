import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { datetime, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const physicalType = mysqlTable('physical_type', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    dateAdded: datetime('date_added').notNull().$default(() => new Date())
});

export type PhysicalType = InferSelectModel<typeof physicalType>;
export type PhysicalTypeInput = InferInsertModel<typeof physicalType>;