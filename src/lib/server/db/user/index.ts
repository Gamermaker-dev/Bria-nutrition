import { db } from '..';
import { user } from '../auth.schema';

const getUsers = async () => {
	return await db.select().from(user);
};

export const userApi = {
	getUsers
};
