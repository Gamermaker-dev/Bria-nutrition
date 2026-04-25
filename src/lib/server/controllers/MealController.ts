import { type Meal } from '$lib/server/db/schema';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';

export class MealController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	private convertMany = (res: Meal[]) => res.map((r) => ({ ...r, id: Number(r.id) }));
	private convertSingle = (res: Meal) => ({
		...res,
		id: Number(res.id)
	});

	public get = async () => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await prisma.meal.findMany().then(this.convertMany);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.meal
				.findUniqueOrThrow({
					where: { id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getMealForDateByUser = async (userId: string, mealDate: Date) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ForDateByUser`);
			const data = await prisma.meal
				.findFirst({
					select: {
						id: true,
						mealDate: true,
						mealFood: { select: { id: true, food: { select: { id: true, name: true } }, amount: true } }
					},
					where: {
						AND: [{ userId, mealDate: mealDate }]
					}
				})
				.then((res) => {
					if (res != null)
						return {
							mealId: Number(res.id),
							mealDate: res.mealDate,
							mealFood: res.mealFood.map((m) => ({
								id: Number(m.id),
								foodId: Number(m.food.id),
								foodName: m.food.name,
								amount: m.amount
							}))
						};

					return undefined;
				});

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
