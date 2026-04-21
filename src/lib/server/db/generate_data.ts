import { eq, max, min } from 'drizzle-orm';
import { db } from '.';
import { user } from './auth.schema';
import { food, meal, mealFood } from './schema';
import { exit } from 'node:process';

const main = async () => {
	const userRecords = await db.select().from(user).where(eq(user.name, 'Gamermaker-dev'));
	const myUser = userRecords[0];

	const minMax = await db.select({ min_val: min(food.id), max_val: max(food.id) }).from(food);
	const minVal = minMax[0].min_val;
	const maxVal = minMax[0].max_val;

	if (minVal && maxVal) {
		for (let k = 0; k < 10; k++) {
			for (let i = 365; i > 0; i--) {
				const NOW = new Date(2020 - k, 3, 1);
				const mealDate = new Date(NOW);
				mealDate.setDate(NOW.getDate() - i);
				const mealId = await db.insert(meal).values({ userId: myUser.id, mealDate }).$returningId();
				for (let j = 0; j < 7; j++) {
					const foodId = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
					await db.insert(mealFood).values({ mealId: mealId[0].id, foodId, amount: 1 });
				}
			}
		}
	}
};

main()
	.then(() => exit())
	.catch(() => exit(1));
