import { type Food, type FoodInput } from '$lib/server/db/schema';
import dayjs from 'dayjs';
import { PrismaClientKnownRequestError } from '../../../prisma/generated/prisma/internal/prismaNamespace';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';
import { CustomFoodError } from '../errors';

export class FoodController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	private convertMany = (res: Food[]) => res.map((r) => ({ ...r, id: Number(r.id) }));
	private convertSingle = (res: Food) => ({
		...res,
		id: Number(res.id)
	});

	public get = async () => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await prisma.food.findMany().then(this.convertMany);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.food
				.findUniqueOrThrow({
					where: { id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getCustomFoodById = async (id: number) => {
		try {
			this.setOperation(`getCustom${this.TABLE_NAME}ById`);
			const data = await prisma.food
				.findUniqueOrThrow({
					select: {
						id: true,
						name: true,
						fdcId: true,
						userId: true,
						dateAdded: true,
						foodNutrient: {
							select: {
								nutrient: {
									select: {
										id: true,
										name: true,
										unit: true,
										fdcNutrientId: true,
										fdcNumber: true,
										dateAdded: true
									}
								},
								amount: true
							}
						}
					},
					where: {
						id
					}
				})
				.then((res) => ({
					...res,
					id: Number(res.id),
					foodNutrient: res.foodNutrient.map((f) => ({
						...f,
						nutrient: {
							...f.nutrient,
							id: Number(f.nutrient.id),
							fdcNutrientId: Number(f.nutrient.fdcNutrientId)
						}
					}))
				}));

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getByUserId = async (userId: string, page: number = 1, search?: string) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ByUserId`);

			const data = await prisma.food
				.findMany({
					where: {
						userId,
						name: { contains: search != '' ? search : undefined }
					},
					take: 50,
					skip: (page - 1) * 50
				})
				.then(this.convertMany);

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getTotalCustomFoods = async (userId: string, search?: string) => {
		try {
			this.setOperation(`getTotalCustom${this.TABLE_NAME}`);
			const data = await prisma.food.count({
				where: {
					userId,
					name: {
						contains: search != '' ? search : undefined
					}
				}
			});

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: FoodInput) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);

			const results = await prisma.$transaction(async (tx) => {
				const TODAY = dayjs.utc().toDate();
				let mealId: number = 0;
				let foodId: number = 0;

				try {
					const existingMeal = await tx.meal
						.findFirstOrThrow({
							where: {
								AND: [{ userId: input.userId }, { mealDate: input.mealDate }]
							}
						})
						.then((res) => ({ ...res, id: Number(res.id) }));

					mealId = existingMeal.id;
				} catch (err: unknown) {
					if (
						(err as PrismaClientKnownRequestError).code != null &&
						(err as PrismaClientKnownRequestError).code === 'P2025'
					) {
						try {
							const newMeal = await tx.meal
								.create({
									data: {
										mealDate: input.mealDate,
										user: { connect: { id: input.userId } },
										dateAdded: TODAY
									}
								})
								.then((r) => ({ ...r, id: Number(r.id) }));

							mealId = newMeal.id;
						} catch (err) {
							console.error('Error creating new meal:', err);
							throw new Error('Failed to create meal!');
						}
					} else {
						console.error('Error fetching existing meal:', err);
						throw new Error('Unexpected error occured in transaction for create food');
					}
				}

				try {
					if (input.id == undefined && input.fdcId === 0)
						throw new CustomFoodError('New food!', 'C1000');
					const whereCondition = input.id != undefined ? { id: input.id } : { fdcId: input.fdcId };
					const existingFood = await tx.food
						.findFirstOrThrow({
							where: whereCondition
						})
						.then(this.convertSingle);

					foodId = existingFood.id;
				} catch (err) {
					if (
						(err instanceof PrismaClientKnownRequestError && err.code === 'P2025') ||
						(err instanceof CustomFoodError && err.code === 'C1000')
					) {
						const data = {
							name: input.name,
							fdcId: 0,
							userId: '',
							foodNutrient: {
								create: input.nutrients.map((n) => ({
									nutrientId: n.nutrientId,
									amount: n.amount
								}))
							},
							dateAdded: TODAY
						};
						if (input.fdcId !== 0) data.fdcId = input.fdcId;
						else data.userId = input.userId;
						const newFood = await tx.food
							.create({
								data
							})
							.then(this.convertSingle);

						foodId = newFood.id;
					} else {
						console.error('Unexpected error finding existing food:', err);
						throw new Error();
					}
				}

				console.log(`Adding meal for meal Id ${mealId} and food Id ${foodId}`);
				try {
					return await tx.mealFood.create({
						data: {
							meal: { connect: { id: mealId } },
							food: { connect: { id: foodId } },
							amount: input.serving
						}
					});
				} catch (err) {
					console.error('Unexpected errr adding meal:', err);
					throw new Error();
				}
			});

			return this.success(results);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number, mealId: number) => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const results = await prisma.$transaction(async (tx) => {
				try {
					await tx.mealFood.delete({
						where: {
							id
						}
					});

					const remainingMeals = await tx.mealFood
						.findMany({
							where: { mealId: mealId }
						})
						.then((res) =>
							res.map((r) => ({ ...r, foodId: Number(r.foodId), mealId: Number(r.mealId) }))
						);

					if (remainingMeals.length === 0) {
						await tx.meal.delete({
							where: { id: mealId }
						});
					}

					return remainingMeals;
				} catch (err) {
					console.error('Unexpected error in delete food transaction:', err);
					throw new Error();
				}
			});
			return this.success(results);
		} catch (err) {
			return this.error(err);
		}
	};
}
