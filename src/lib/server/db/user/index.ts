import { db } from '..';
import { user } from '../auth.schema';
import { profile, type ProfileInput } from '$lib/server/db/user/profile.schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

const getUsers = async () => {
	return await db.select().from(user);
};

const getUsersWithProfile = async () => {
	return await db
		.select({
			userId: user.id,
			email: user.email,
			profile: {
				profileId: profile.id,
				firstName: profile.firstName,
				lastName: profile.lastName,
				age: profile.age,
				sex: profile.sex,
				inches: profile.heightInch,
				feet: profile.heightFeet,
				weight: profile.weight,
				dateAdded: profile.dateAdded,
				dateUpdated: profile.dateUpdated,
				dateDeleted: profile.dateDeleted
			}
		})
		.from(user)
		.innerJoin(profile, eq(user.id, profile.userId));
};

const getUserProfileById = async (userId: string) => {
	const results = await db.select().from(profile).where(eq(profile.userId, userId));

	if (results.length > 1) error(500, { message: 'More than one profile returned.' });
	return results.length === 1 ? results[0] : undefined;
};

const insertProfile = async (newProfile: ProfileInput) => {
	return await db.insert(profile).values(newProfile);
};

export const userApi = {
	getUsers,
	getUsersWithProfile,
	getUserProfileById,

	insertProfile
};
