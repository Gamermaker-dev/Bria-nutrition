import { type ActivityLevelInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import dayjs from 'dayjs';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';


export class ActivityLevelController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	public get = async () => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await prisma.activityLevel.findMany().then((res) =>
				res.map((r) => {
					return {
						id: Number(r.id),
						name: r.name,
						description: r.description,
						multiplier: r.multiplier?.toNumber(),
						dateAdded: r.dateAdded
					};
				})
			);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.activityLevel
				.findUniqueOrThrow({
					where: { id }
				})
				.then((res) => {
					return { ...res, id: Number(res.id), multiplier: res.multiplier?.toNumber() };
				});
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDropdown = async (): Response<{ label: string; value: number }[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}Dropdown`);

			const data = await prisma.activityLevel
				.findMany()
				.then((res) => res.map((r) => ({ label: r.name, value: Number(r.id) })));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: ActivityLevelInput) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await prisma
				.$transaction([
					prisma.activityLevel.create({
						data: {
							name: input.name,
							description: input.description,
							multiplier: input.multiplier,
							dateAdded: dayjs.utc().toDate()
						}
					})
				])
				.then((res) =>
					res.map((r) => ({ ...r, id: Number(r.id), multiplier: r.multiplier?.toNumber() }))
				);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: ActivityLevelInput) => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await prisma.activityLevel
				.update({
					data: {
						name: input.name,
						description: input.description,
						multiplier: input.multiplier
					},
					where: { id: input.id }
				})
				.then((res) => ({ ...res, id: Number(res.id), multiplier: res.multiplier?.toNumber() }));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number) => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await prisma.activityLevel
				.delete({
					where: { id }
				})
				.then((res) => ({ ...res, id: Number(res.id), multiplier: res.multiplier?.toNumber() }));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
