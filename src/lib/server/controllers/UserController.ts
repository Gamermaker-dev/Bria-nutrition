import {
	and,
	asc,
	between,
	desc,
	eq,
	gte,
	inArray,
	isNull,
	lte,
	or,
	SQL,
	sql,
	sum
} from 'drizzle-orm';
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
import { formatDate } from '$lib/util';
import type { HealthReport } from '$lib/types/HealthReport';

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
					.where(and(eq(this.TABLE.userId, id), isNull(this.TABLE.nextProfileId)))
			);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDashboard = async (userId: string, mealDate: Date): Response<Dashboard | undefined> => {
		try {
			this.setOperation('getDashboard');

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
				.where(and(eq(meal.userId, userId), eq(meal.mealDate, mealDate)))
				.as('userFoodList');

			const labelSum = (label: string, alias: string) =>
				sql<number>`SUM(IF(${eq(sub.nutrientLabel, label)}, ${sub.amountPerServing} * ${sub.amountPerMeal} / IF(${eq(sub.unit, 'MG')}, 1000, 1), 0))`.as(
					alias
				);

			const profiles = await db
				.select()
				.from(this.TABLE)
				.where(
					and(
						eq(this.TABLE.userId, userId),
						or(
							isNull(this.TABLE.nextProfileId),
							lte(sql<Date>`${mealDate}`, this.TABLE.dateUpdated)
						)
					)
				)
				.orderBy(desc(this.TABLE.dateAdded));

			let profileToUse =
				profiles.length === 1
					? profiles[0]
					: profiles.find((p, i) => {
							if (i === profiles.length - 1) return p;
							else {
								if (mealDate >= p.dateAdded) return p;
							}
						});
			if (!profileToUse) profileToUse = profiles[profiles.length - 1];

			if (profileToUse == undefined) throw error(500, { message: 'User has no profile!' });

			const data = await db
				.select({
					userId: sub.userId,
					mealDate: sub.mealDate,
					age: sql<number>`IF(${this.TABLE.age} IS NULL, 1, ${this.TABLE.age})`.as('age'),
					sex: sql<'M' | 'F'>`IF(${this.TABLE.physicalTypeId} = 1, 'M', 'F')`.as('sex'),
					height: sql<number>`(${this.TABLE.heightFeet}*12 + ${this.TABLE.heightInch}) * 2.54`.as(
						'height'
					),
					weight: sql<number>`${this.TABLE.weight}/2.205`.as('weight'),
					activityLevelMultiplier:
						sql<number>`IF(${activityLevel.multiplier} IS NULL, 1, ${activityLevel.multiplier})`.as(
							'activityLevelMultiplier'
						),
					calories: labelSum('Calories', 'calories'),
					carbs: labelSum('Carbs', 'carbs'),
					protein: labelSum('Protein', 'protein'),
					fat: labelSum('Fat', 'fat')
				})
				.from(sub)
				.innerJoin(this.TABLE, eq(sub.userId, this.TABLE.userId))
				.innerJoin(activityLevel, eq(this.TABLE.activityLevelId, activityLevel.id))
				.where(eq(this.TABLE.id, profileToUse.id))
				.groupBy(sub.userId, sub.mealDate);

			return this.success(data.length === 1 ? data[0] : undefined);
		} catch (err) {
			return this.error(err);
		}
	};

	public getHealthReport = async (
		userId: string,
		startDate: Date,
		endDate: Date
	): Response<HealthReport> => {
		try {
			this.setOperation(`getHealthReport`);
			const sub = db
				.select({
					userId: this.TABLE.userId,
					mealDate: meal.mealDate,
					nutrientName: label.name,
					amount: sql<number>`${mealFood.amount} * ${foodNutrient.amount}`.as('amount')
				})
				.from(this.TABLE)
				.innerJoin(meal, eq(this.TABLE.userId, meal.userId))
				.innerJoin(mealFood, eq(meal.id, mealFood.mealId))
				.innerJoin(foodNutrient, eq(mealFood.foodId, foodNutrient.foodId))
				.innerJoin(labelNutrient, eq(foodNutrient.nutrientId, labelNutrient.nutrientId))
				.innerJoin(label, eq(labelNutrient.labelId, label.id))
				.where(
					and(
						eq(this.TABLE.userId, userId),
						between(meal.mealDate, startDate, endDate),
						inArray(label.id, [1, 2, 3, 7])
					)
				)
				.as('report');

			const data = await db
				.select({
					userId: sub.userId,
					mealDate: sub.mealDate,
					nutrientName: sub.nutrientName,
					amount: sum(sub.amount)
				})
				.from(sub)
				.groupBy(sub.userId, sub.mealDate, sub.nutrientName);

			return this.success(data);
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
				let currDateAdded: string = '';
				const newDateAdded: string = formatDate(new Date());
				const curr = await tx
					.select()
					.from(this.TABLE)
					.where(and(eq(this.TABLE.userId, input.userId), isNull(this.TABLE.nextProfileId)));
				if (curr.length! == 1) {
					const currProfile = curr[0];
					currDateAdded = formatDate(currProfile.dateAdded);
				}

				if (newDateAdded != currDateAdded) {
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
							nextProfileId: null,
							dateUpdated: null
						})
						.$returningId();

					if (newInsert.length > 0) {
						const updateResults = await tx
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
				} else {
					if (input.id) {
						const updateResults = await tx
							.update(this.TABLE)
							.set({
								id: input.id,
								birthDate: input.birthDate,
								weight: input.weight,
								heightFeet: input.heightFeet,
								heightInch: input.heightInch,
								physicalTypeId: input.physicalTypeId,
								activityLevelId: input.activityLevelId,
								dateUpdated: new Date()
							})
							.where(eq(this.TABLE.id, input.id));

						if (updateResults[0].affectedRows > 0) {
							return updateResults;
						} else tx.rollback();
					} else tx.rollback();
				}
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
