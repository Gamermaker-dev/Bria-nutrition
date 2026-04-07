import type { FoodInput, Nutrient } from "$lib/server/db/schema";

export const validate = (formData: FormData, nutrients: Nutrient[]) => {
	const errors: string[] = [];
	let name: string = '';
	let carbs: number = 0;
	let protein: number = 0;
	let fat: number = 0;

    const carbId = nutrients.find((n) => n.name === 'carbs')

	const rawName = formData.get('name')?.toString();
	if (!rawName) errors.push('Name is required.');
	else {
		name = rawName;
	}

	const rawCarbs = formData.get('carbs')?.toString();
	if (!rawCarbs) errors.push('Carbs are required');
	else {
		carbs = parseFloat(rawCarbs);
		if (isNaN(carbs)) errors.push('Carbs must be numeric!');
	}

	const rawProtein = formData.get('protein')?.toString();
	if (!rawProtein) errors.push('Protein are required');
	else {
		protein = parseFloat(rawProtein);
		if (isNaN(protein)) errors.push('Protein must be numeric!');
	}

	const rawFat = formData.get('fat')?.toString();
	if (!rawFat) errors.push('Fat is required');
	else {
		fat = parseFloat(rawFat);
		if (isNaN(fat)) errors.push('Fat must be numeric!');
	}

	return errors.length > 0
		? {
				input: undefined,
				errors
			}
		: {
				input: {
					name,
                    nutrients: 
					carbs,
					protein,
					fat
				} as FoodInput,
				errors
			};
};
