import { eq } from 'drizzle-orm';
import { db } from '.';
import { fdcNutrient, food, foodNutrient, nutrient } from './schema';
import { exit } from 'node:process';

const main = async () => {
	const res = await db
		.insert(foodNutrient)
		.select(
			db
				.select({ foodId: food.id, nutrientId: nutrient.id, amount: fdcNutrient.amount })
				.from(fdcNutrient)
				.innerJoin(food, eq(fdcNutrient.fdcId, food.fdcId))
				.innerJoin(nutrient, eq(fdcNutrient.nutrientId, nutrient.fdcNutrientId))
		);
	if (res[0].affectedRows > 0) {
		console.log(`Successfully inserted ${res[0].affectedRows} rows!`);
	} else {
		console.error('Failed to insert rows!');
	}
	return res;
};

main()
	.then(() => exit())
	.catch(() => exit(1));
