import { exit } from 'node:process';
import { prisma } from './prisma';

const main = async () => {
	const myUser = await prisma.user.findFirstOrThrow({
		where: { name: 'Gamermaker-dev' }
	});

	const minMax = await prisma.food
		.aggregate({
			_min: { id: true },
			_max: { id: true }
		})
		.then((res) => ({ min: Number(res._min), max: Number(res._max) }));
	const minVal = minMax.min;
	const maxVal = minMax.max;

	if (minVal && maxVal) {
		for (let k = 0; k < 10; k++) {
			for (let i = 365; i > 0; i--) {
				const NOW = new Date(2020 - k, 3, 1);
				const mealDate = new Date(NOW);
				mealDate.setDate(NOW.getDate() - i);
				const meal = await prisma.meal
					.create({
						data: {
							userId: myUser.id,
							mealDate,
							dateAdded: new Date()
						}
					})
					.then((res) => ({ ...res, id: Number(res.id) }));
				for (let j = 0; j < 7; j++) {
					const foodId = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
					await prisma.mealFood.create({
						data: { mealId: meal.id, foodId, amount: 1 }
					});
				}
			}
		}
	}
};

main()
	.then(() => exit())
	.catch(() => exit(1));
