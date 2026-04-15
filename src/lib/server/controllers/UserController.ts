import { and, between, eq, gte, inArray, isNull, or, sql } from 'drizzle-orm';
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
	physicalType,
	label,
	labelNutrient
} from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import type { Dashboard } from '$lib/types/Dashboard';
import type { SelectedFields } from 'drizzle-orm/mysql-core';
import { profileLabel } from '../db/profile_label/schema';
import { error } from '@sveltejs/kit';

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

	public getById = async (id: string): Response<UserWithProfile> => {
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

			const sub = db
				.select({
					userId: meal.userId,
					mealDate: meal.mealDate,
					nutrientLabel: sql`${label.name}`.as('nutrientLabel'),
					fdcNumber: nutrient.fdcNumber,
					amountPerServing: sql<number>`${foodNutrient.amount}`.as('amountPerServing'),
					amountPerMeal: sql<number>`${mealFood.amount}`.as('amountPerMeal'),
					unit: nutrient.unit
				})
				.from(meal)
				.innerJoin(mealFood, eq(meal.id, mealFood.mealId))
				.innerJoin(foodNutrient, eq(mealFood.foodId, foodNutrient.foodId))
				.innerJoin(labelNutrient, eq(foodNutrient.nutrientId, labelNutrient.nutrientId))
				.innerJoin(label, eq(labelNutrient.labelId, label.id))
				.innerJoin(nutrient, eq(foodNutrient.nutrientId, nutrient.id))
				.where(and(eq(meal.userId, userId), eq(meal.mealDate, new Date(2026, 3, 10))))
				.as('userFoodList');

			const labelSum = (label: string, alias: string) =>
				sql<number>`SUM(IF(${eq(sub.nutrientLabel, label)}, ${sub.amountPerServing} * ${sub.amountPerMeal} / IF(${eq(sub.unit, 'MG')}, 1000, 1), 0))`.as(alias);

			const data = await db
				.select({
					userId: sub.userId,
					mealDate: sub.mealDate,
					calories: labelSum('Calories', 'calories'),
					carbs: labelSum('Carbs', 'carbs'),
					protein: labelSum('Protein', 'protein'),
					fat: labelSum('Fat', 'fat'),
					cholesterol: labelSum('Cholesterol', 'cholesterol'),
					sodium: labelSum('Sodium', 'sodium'),
					fiber: labelSum('Fiber', 'fiber'),
					totalSugars: labelSum('Total Sugars', 'totalSugars'),
					addedSugars: labelSum('Added Sugars', 'addedSugars'),
					vitaminD: labelSum('Vitamin D', 'vitaminD'),
					iron: labelSum('Iron', 'iron'),
					calcium: labelSum('Calcium', 'calcium'),
					potassium: labelSum('Potassium', 'potassium')
				})
				.from(sub)
				.groupBy(sub.userId, sub.mealDate);

			if (data.length !== 1) throw error(500, 'Error encountered fetching Dashboard!');

			return this.success(data[0]);
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
