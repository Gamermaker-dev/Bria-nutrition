import { eq } from 'drizzle-orm';
import { db } from '.';
import { user } from './auth.schema';
import { type FoodInput } from './schema';
import { exit } from 'node:process';
import { formatDate } from '$lib/util';
import { foodController } from '../controllers';

const main = async () => {
	const userRecords = await db.select().from(user).where(eq(user.name, 'Gamermaker-dev'));
	const myUser = userRecords[0];


		for (let i = 365; i > 0; i--) {
			const NOW = new Date(2021, 3, 1);
			const mealDate = new Date(NOW);
			mealDate.setDate(NOW.getDate() - i);
			for (let j = 0; j < 7; j++) {
				const foodInput: FoodInput = {
					fdcId: 0,
					mealDate: formatDate(mealDate),
					name: `Test_Food_${Math.ceil(Math.random() * 100)}`,
					serving: 1,
					nutrients: [
						{ nutrientId: 10, amount: Math.ceil(Math.random() * 400) },
						{ nutrientId: 7, amount: Math.ceil(Math.random() * 300) },
						{ nutrientId: 5, amount: Math.ceil(Math.random() * 150) },
						{ nutrientId: 6, amount: Math.ceil(Math.random() * 200) }
					],
					userId: myUser.id
				};
				await foodController.create(foodInput);
			}
		}
};

main()
	.then(() => exit())
	.catch(() => exit(1));
