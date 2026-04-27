import z from 'zod';

export const emailLoginSchema = z.object({
	email: z.string().nonempty('Email must be provided!').nonoptional(),
	password: z.string().nonempty('Password musy be provided!').nonoptional()
});

export const registerSchema = z.object({
	email: z.string().nonempty('Email must be provided!').nonoptional(),
	name: z.string().nonoptional(),
	password: z.string().nonempty('Password musy be provided!').min(8, 'Password must be at least 8 characters!'),
	confirmPassword: z.string().nonoptional()
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match!',
	path: ['confirmPassword']
});

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
export const addCustomFoodSchema = z.object({
	name: z.string().nonoptional('Name is required!'),
	calories: z.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		}).nonoptional('Calories are required!'),
	carbs: z.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		}).nonoptional('Carbs are required!'),
	protein: z.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		}).nonoptional('Protein is required!'),
	fat: z.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		}).nonoptional('Fat is required!'),
	serving: z
		.string({
			error: (issue) => {
				if (isNaN(parseFloat(`${issue.input}`))) return { message: 'Value must be numerical!' };
			}
		})
		.nonempty('Serving must be provided!'),
	mealDate: z.string({
		error: (issue) => {
			if (!(new Date(issue.input as string) instanceof Date)) return { message: 'Value must be a date!' };
		}
	}).nonoptional('Meal date is required!'),
})

export const deleteFoodSchema = z.object({
	id: z.number().nonoptional('ID is required!'),
	mealId: z.number().nonoptional('Meal is required!')
});
