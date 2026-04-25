import { exit } from 'node:process';
import { prisma } from './prisma';

const main = async () => {
	const fdc = await prisma.$queryRaw<{ foodId: bigint; nutrientId: bigint; amount: number }[]>`
		SELECT f.id, n.id, fdc.amount
		FROM fdcNutrient fdc
		JOIN food f ON fdc.fdcId = f.fdcId
		JOIN nutrient n ON fdc.nutrientId = n.fdcNutrientId
	`.then((res) =>
		res.map((r) => ({ ...r, foodId: Number(r.foodId), nutrientId: Number(r.nutrientId) }))
	);
	const res = await prisma.foodNutrient.createMany({
		data: fdc
	});

	if (res.count > 0) {
		console.log(`Successfully inserted ${res.count} rows!`);
	} else {
		console.error('Failed to insert rows!');
	}
	return res;
};

main()
	.then(() => exit())
	.catch(() => exit(1));
