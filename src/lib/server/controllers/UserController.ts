import { and, between, eq, gte, isNull, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	foodNutrient,
	mealFood,
	nutrient,
	profile,
	user,
	recommendation,
	type Profile,
	type ProfileInput,
	type UserWithProfile,
	activityLevel,
	meal,
	physicalType
} from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import type { Dashboard } from '$lib/types/Dashboard';
import type { SelectedFields } from 'drizzle-orm/mysql-core';

export class UserController extends BaseModelController<typeof profile> {
	private fullProfileSelect: SelectedFields;

	constructor(tableName: string, table: typeof profile) {
		super(tableName, table);
		this.fullProfileSelect = {
			userId: user.id,
			email: user.email,
			profile: {
				id: this.TABLE.id,
				userId: this.TABLE.userId,
				birthDate: this.TABLE.birthDate,
				age: this.TABLE.age,
				physicalTypeId: this.TABLE.physicalTypeId,
				physicalType: {
					id: physicalType.id,
					name: physicalType.name
				},
				heightInch: this.TABLE.heightInch,
				heightFeet: this.TABLE.heightFeet,
				weight: this.TABLE.weight,
				activityLevelId: this.TABLE.activityLevelId,
				activityLevel: {
					id: activityLevel.id,
					name: activityLevel.name
				},
				dateAdded: this.TABLE.dateAdded,
				dateUpdated: this.TABLE.dateUpdated,
				dateDeleted: this.TABLE.dateDeleted
			}
		};
	}

	public get = async (): Response<UserWithProfile[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await db
				.select(this.fullProfileSelect)
				.from(this.TABLE)
				.innerJoin(user, eq(this.TABLE.userId, user.id))
				.innerJoin(physicalType, eq(this.TABLE.physicalTypeId, physicalType.id))
				.innerJoin(activityLevel, eq(this.TABLE.activityLevelId, activityLevel.id));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: string): Response<Profile> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = this.returnOneRecord(
				await db
					.select(this.fullProfileSelect)
					.from(this.TABLE)
                    .innerJoin(user, eq(this.TABLE.userId, user.id))
					.innerJoin(physicalType, eq(this.TABLE.physicalTypeId, physicalType.id))
					.innerJoin(activityLevel, eq(this.TABLE.activityLevelId, activityLevel.id))
					.where(eq(this.TABLE.userId, id))
			);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDashboard = async (userId: string): Response<Dashboard> => {
		try {
			this.setOperation('getDashboard');
			const TODAY = new Date();

			const actualSubquery = db
				.select({
					nutrientId: nutrient.id,
					actualAmount: sql<number>`sum(${foodNutrient.amount})`.as('actualAmount')
				})
				.from(nutrient)
				.innerJoin(foodNutrient, eq(nutrient.id, foodNutrient.nutrientId))
				.innerJoin(mealFood, eq(foodNutrient.foodId, mealFood.foodId))
				.innerJoin(meal, eq(mealFood.mealId, meal.id))
				.where(and(eq(meal.userId, userId), eq(meal.mealDate, new Date(TODAY.toDateString()))))
				.groupBy(nutrient.id)
				.as('nutrientAmount');

			const data = await db
				.select({
					id: nutrient.id,
					name: nutrient.name,
					tdee: sql<number>`ROUND(((10 * (${this.TABLE.weight} / 2.205)) + (6.25 * ((${this.TABLE.heightFeet}*12)+${this.TABLE.heightInch}) * 2.54) - (5 * ${this.TABLE.heightFeet}) + 5) * ${activityLevel.multiplier})`.as(
						'tdee'
					),
					recommended: sql<number>`NVL(${recommendation.amount}, 0) as recommended`,
					actual: sql<number>`NVL(${actualSubquery.actualAmount}, 0) as actual`
				})
				.from(nutrient)
				.innerJoin(this.TABLE, eq(this.TABLE.userId, userId))
				.innerJoin(activityLevel, eq(this.TABLE.activityLevelId, activityLevel.id))
				.leftJoin(recommendation, eq(nutrient.id, recommendation.nutrientId))
				.leftJoin(actualSubquery, eq(nutrient.id, actualSubquery.nutrientId))
				.where(
					and(
						eq(this.TABLE.physicalTypeId, recommendation.physicalTypeId),
						or(
							between(this.TABLE.age, recommendation.minAge, recommendation.maxAge),
							and(gte(this.TABLE.age, recommendation.minAge), isNull(recommendation.maxAge))
						)
					)
				);

			return this.success({ nutrients: data });
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: ProfileInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await db.insert(this.TABLE).values(input);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: ProfileInput): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await db.transaction(async (tx) => {
				const dateUpdated: Date = new Date();
				const newInsert = await tx
					.insert(this.TABLE)
					.values({
						userId: input.userId,
						birthDate: input.birthDate,
						physicalTypeId: input.physicalTypeId,
						heightInch: input.heightInch,
						heightFeet: input.heightFeet,
						weight: input.weight,
						activityLevelId: input.activityLevelId,
						nextProfileId: null
					})
					.$returningId();

				if (newInsert.length > 0) {
					const updateResults = await db
						.update(this.TABLE)
						.set({
							nextProfileId: newInsert[0].id,
							dateUpdated: new Date()
						})
						.where(eq(this.TABLE.id, input.id as number));

					if (updateResults[0].affectedRows > 0) {
						return updateResults;
					} else tx.rollback();
				} else tx.rollback();
			});
			if (data == null) return this.error('Error occurred in transaction!');
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number): Response<MySqlRawQueryResult> => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await db
				.update(this.TABLE)
				.set({
					dateDeleted: new Date()
				})
				.where(eq(this.TABLE.id, id));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
