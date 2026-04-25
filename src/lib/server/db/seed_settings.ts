import { prisma } from './prisma';

const main = async () => {
	console.log('Inserting physical body types...');
	const dateAdded = new Date();
	await prisma.physicalType.createMany({
		data: [
			{ name: 'Male', dateAdded },
			{ name: 'Female', dateAdded },
			{ name: 'Pregnant', dateAdded },
			{ name: 'Lactating', dateAdded }
		]
	});

	console.log('Inserting activity levels...');
	await prisma.activityLevel.createMany({
		data: [
			{ name: 'Sedentary', multiplier: '1.2', description: '< 1 day of exercise', dateAdded },
			{ name: 'Light', multiplier: '1.375', description: '1-3 days of exercise', dateAdded },
			{ name: 'Moderate', multiplier: '1.55', description: '3-5 days of exercise', dateAdded },
			{ name: 'Very', multiplier: '1.725', description: '6-7 days of exercise', dateAdded },
			{ name: 'Extreme', multiplier: '1.9', description: '7+ days of exercise', dateAdded }
		]
	});

	console.log('Inserting labels...');
	await prisma.label.createMany({
		data: [
			{ name: 'Calories', dateAdded },
			{ name: 'Carbs', dateAdded },
			{ name: 'Protein', dateAdded },
			{ name: 'Cholesterol', dateAdded },
			{ name: 'Sodium', dateAdded },
			{ name: 'Fiber', dateAdded },
			{ name: 'Total Sugars', dateAdded },
			{ name: 'Added Sugars', dateAdded },
			{ name: 'Vitamin D', dateAdded },
			{ name: 'Calcium', dateAdded },
			{ name: 'Iron', dateAdded },
			{ name: 'Potassium', dateAdded }
		]
	});
};

main();
