import { and, desc, eq, isNull, lte, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { profile, profileWithUser, type ProfileInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import type { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import type { Dashboard } from '$lib/types/Dashboard';
import { error } from '@sveltejs/kit';
import { formatDate } from '$lib/util';
import type { HealthReport } from '$lib/types/HealthReport';
import { prisma } from '../db/prisma';

export class UserController extends BaseModelController<typeof profile> {
	constructor(tableName: string, table: typeof profile) {
		super(tableName, table);
	}

	public getById = async (id: string) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.profile.findFirstOrThrow({
				...profileWithUser,
				where: { AND: [{ userId: id }, { nextProfileId: null }] }
			});

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDashboard = async (userId: string, mealDate: Date) => {
		try {
			this.setOperation('getDashboard');

			const profiles = await prisma.profile.findMany({
				where: {
					AND: [
						{ userId: userId },
						{
							OR: [
								{ nextProfileId: null },
								{
									dateUpdated: {
										gt: mealDate
									}
								}
							]
						}
					]
				},
				orderBy: { dateAdded: 'desc' }
			});

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

			const data = await prisma.$queryRaw`
					 select t.[userId],
							t.[mealDate],
							IIF([p].[age] IS NULL, 1, p.[age]) as age,
							IIF(p.[physicalTypeId] = 1, 'M', 'F') as sex,
							(p.[heightFeet] * 12 + p.[heightInch]) * 2.54 as height,
							p.[weight] / 2.205 as weight,
							IIF(al.[multiplier] IS NULL, 1, al.[multiplier]) as activityLevelMultiplier,
							SUM(IIF(nutrientLabel = 'Calories', amountPerServing * amountPerMeal / IIF(t.[unit] = 'MG', 1000, 1), 0)) as calories,
							SUM(IIF(nutrientLabel = 'Carbs', amountPerServing * amountPerMeal / IIF(t.[unit] = 'MG', 1000, 1), 0)) as carbs,
							SUM(IIF(nutrientLabel = 'Protein', amountPerServing * amountPerMeal / IIF(t.[unit] = 'MG', 1000, 1), 0)) as protein,
							SUM(IIF(nutrientLabel = 'Fat', amountPerServing * amountPerMeal / IIF(t.[unit] = 'MG', 1000, 1), 0)) as fat
						from
							(
							select
								m.[userId],
								m.[mealDate],
								l.[name] as nutrientLabel,
								n.[fdcNumber],
								fn.[amount] as amountPerServing,
								mf.[amount] as amountPerMeal,
								n.[unit]
							from
								dbo.[meal] m
							inner join dbo.[mealFood] mf on
								m.[id] = mf.[mealId]
							inner join dbo.[foodNutrient] fn on
								mf.[foodId] = fn.[foodId]
							inner join dbo.[labelNutrient] ln on
								fn.[nutrientId] = ln.[nutrientId]
							inner join dbo.[label] l on
								ln.[labelId] = l.[id]
							inner join dbo.[nutrient] n on
								fn.[nutrientId] = n.[id]
							where
								m.[userId] = ${userId}
							and m.[mealDate] = ${formatDate(mealDate)}
									) [t]
						inner join dbo.[profile] p on
							t.[userId] = p.[userId]
						inner join dbo.[activityLevel] al on
							p.[activityLevelId] = al.[id]
						where
							p.[id] = ${profileToUse.id}
						group by
							t.[userId],
							t.[mealDate],
							p.[age],
							p.[physicalTypeId],
							p.[heightFeet],
							p.[heightInch],
							p.[weight],
							al.[multiplier]`;

			// convert types
			//@ts-expect-error unknown type
			data.forEach((d) => {
				d.height = d.height.toNumber();
				d.weight = d.weight.toNumber();
				d.activityLevelMultiplier = d.activityLevelMultiplier.toNumber();
			})

			//@ts-expect-error unknown type
			return this.success(data.length === 1 ? data[0] as Dashboard : undefined);
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

			const data = await prisma.$queryRaw<HealthReport>`
			    select
					[userId],
					[mealDate],
					[name] AS nutrientName,
					sum([amount]) AS amount
				from
					(
					select
						p.[userId],
						m.[mealDate],
						l.[name],
						mf.[amount] * fn.[amount] as [amount]
					from
						dbo.[profile] p
					inner join dbo.[meal] m on
						p.[userId] = m.[userId]
					inner join dbo.[mealFood] mf on
						m.[id] = mf.[mealId]
					inner join dbo.[foodNutrient] fn on
						mf.[foodId] = fn.[foodId]
					inner join dbo.[labelNutrient] ln on
						fn.[nutrientId] = ln.[nutrientId]
					inner join dbo.[label] l on
						ln.[labelId] = l.[id]
					where
						(p.[userId] = ${userId}
							and m.[mealDate] between ${startDate} and ${endDate}
							and ln.[labelId] in (1, 2, 3, 13))) [report]
				group by
					[report].[userId],
					[report].[mealDate],
					[report].[name]
			`;

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
