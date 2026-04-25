import { profileWithUser, type ProfileInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import type { Dashboard } from '$lib/types/Dashboard';
import type { HealthReport } from '$lib/types/HealthReport';
import { calculateAge, formatDate } from '$lib/util';
import { error } from '@sveltejs/kit';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';

export class UserController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	public getById = async (id: string) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.profile
				.findFirstOrThrow({
					...profileWithUser,
					where: { AND: [{ userId: id }, { nextProfileId: null }] }
				})
				.then((res) => ({
					...res,
					id: Number(res.id),
					activityLevelId: Number(res.activityLevelId),
					physicalTypeId: Number(res.physicalTypeId),
					weight: res.weight.toNumber()
				}));

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDashboard = async (userId: string, mealDate: Date) => {
		try {
			this.setOperation('getDashboard');

			const profiles = await prisma.$queryRaw<
				{
					id: bigint;
					dateAdded: Date;
				}[]
			>`
			    SELECT
					[dbo].[profile].[id],
					[dbo].[profile].[dateAdded]
				FROM
					[dbo].[profile]
				WHERE
					[dbo].[profile].[userId] = ${userId}
					AND (nextProfileId IS NULL OR
					(CAST(dateAdded AS Date) <= ${mealDate}
					AND CAST(dateUpdated AS Date) > ${mealDate}))
				ORDER BY
					[dbo].[profile].[dateAdded]
			`.then((res) => res.map((r) => ({ ...r, id: Number(r.id) })));

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
			});

			//@ts-expect-error unknown type
			return this.success(data.length === 1 ? (data[0] as Dashboard) : undefined);
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
				order by [report].[mealDate]
			`;

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: ProfileInput) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await prisma.profile
				.create({
					data: {
						birthDate: input.birthDate,
						physicalType: {
							connect: { id: input.physicalType.connect?.id }
						},
						heightFeet: input.heightFeet,
						heightInch: input.heightInch,
						weight: input.weight,
						user: {
							connect: {
								id: input.user.connect?.id
							}
						},
						activityLevel: {
							connect: { id: input.activityLevel.connect?.id }
						},
						dateAdded: new Date()
					}
				})
				.then((res) => ({
					...res,
					id: Number(res.id),
					nextProfileId: res.nextProfileId ? Number(res.nextProfileId) : null,
					activityLevelId: Number(res.activityLevelId),
					physicalTypeId: Number(res.physicalTypeId),
					weight: res.weight.toNumber()
				}));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: ProfileInput) => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await prisma.$transaction(async (tx) => {
				try {
					let currDateAdded: string = '';
					const newDateAdded: string = formatDate(new Date());
					const curr = await tx.profile.findFirst({
						where: { AND: [{ userId: input.user.connect?.id }, { nextProfileId: null }] }
					});
					if (curr) {
						currDateAdded = formatDate(curr.dateAdded);
					}

					if (newDateAdded != currDateAdded) {
						const newInsert = await tx.profile.create({
							data: {
								user: {
									connect: { id: input.user.connect?.id }
								},
								birthDate: input.birthDate,
								age: calculateAge(input.birthDate),
								physicalType: {
									connect: { id: input.physicalType.connect?.id }
								},
								heightInch: input.heightInch,
								heightFeet: input.heightFeet,
								weight: input.weight,
								activityLevel: {
									connect: { id: input.activityLevel.connect?.id }
								},
								dateAdded: new Date()
							}
						});

						return await tx.profile
							.update({
								data: {
									nextProfileId: newInsert.id,
									dateUpdated: new Date()
								},
								where: { id: input.id }
							})
							.then((res) => ({
								...res,
								id: Number(res.id),
								nextProfileId: res.nextProfileId ? Number(res.nextProfileId) : null,
								activityLevelId: Number(res.activityLevelId),
								physicalTypeId: Number(res.physicalTypeId),
								weight: res.weight.toNumber()
							}));
					} else {
						if (input.id) {
							return await tx.profile
								.update({
									data: {
										birthDate: input.birthDate,
										age: calculateAge(input.birthDate),
										weight: input.weight,
										heightFeet: input.heightFeet,
										heightInch: input.heightInch,
										physicalTypeId: input.physicalType.connect?.id,
										activityLevelId: input.activityLevel.connect?.id,
										dateUpdated: new Date()
									},
									where: { id: input.id }
								})
								.then((res) => ({
									...res,
									id: Number(res.id),
									nextProfileId: res.nextProfileId ? Number(res.nextProfileId) : null,
									activityLevelId: Number(res.activityLevelId),
									physicalTypeId: Number(res.physicalTypeId),
									weight: res.weight.toNumber()
								}));
						}
						console.error(
							'Transaction error in UpdateProfile',
							new Error('Update attempted without ID!')
						);
					}
				} catch (err) {
					console.error('Transaction error in UpdateProfile:', err);
				}
			});
			if (data == null) return this.error('Error occurred in transaction!');
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number) => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await prisma.profile
				.update({
					data: { dateDeleted: new Date() },
					where: { id }
				})
				.then((res) => ({
					...res,
					id: Number(res.id),
					nextProfileId: res.nextProfileId ? Number(res.nextProfileId) : null,
					activityLevelId: Number(res.activityLevelId),
					physicalTypeId: Number(res.physicalTypeId),
					weight: res.weight.toNumber()
				}));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
