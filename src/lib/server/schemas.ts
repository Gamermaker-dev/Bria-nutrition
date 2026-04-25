import z from 'zod';

export const addProfileSchema = z.object({
	birthDate: z.date().nonoptional('Birth Date is required!'),
	heightFeet: z.int().min(1, 'Height must be single digit!').gt(0, 'Invalid value!'),
	heightInch: z
		.int()
		.min(2, 'Inches cannot be more than two digits!')
		.lte(12, 'Inch must be below 12!'),
	physicalTypeId: z.int().nonoptional('Physical Type required!'),
	activityLevelId: z.int().nonoptional('Activity Level required!'),
	weight: z
		.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		})
		.nonempty('Must be provided!')
});
export const updateProfileSchema = addProfileSchema.extend({
	id: z.number().nonoptional('ID is required!')
});

const nutrientSchema = z.object({
	number: z.string().nonoptional('Nutrient number required!'),
    amount: z.number().nonoptional('Nutrient amount is required!')
});
export const addFoodSchema = z.object({
	id: z.number().optional(),
	fdcId: z.number().nonoptional('FDC Id is required!'),
	mealDate: z.date().nonoptional('Meal date is required!'),
    name: z.string().nonoptional('Name is required!'),
	serving: z
		.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		})
		.nonempty('Serving must be provided!'),
	nutrients: z.array(nutrientSchema).nonempty('Nutrients must be provided!')
});

export const deleteFoodSchema = z.object({
	id: z.number().nonoptional('ID is required!'),
	mealId: z.number().nonoptional('Meal is required!')
});
