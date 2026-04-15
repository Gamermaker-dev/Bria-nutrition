import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { bigint, index, mysqlTable } from 'drizzle-orm/mysql-core';
import { profile, label } from '../schema';

export const profileLabel = mysqlTable(
	'profile_label',
	{
		profileId: bigint('profile_id', { mode: 'number', unsigned: true }).notNull().references(() => profile.id),
		labelId: bigint('label_id', { mode: 'number', unsigned: true }).notNull().references(() => label.id),
	},
	(table) => [index('profileId_indx').on(table.profileId)]
);

export type ProfileLabel = InferSelectModel<typeof profileLabel>;
export type ProfileLabelInput = InferInsertModel<typeof profileLabel>;
