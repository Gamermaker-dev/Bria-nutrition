import { type Nutrient, type NutrientInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';

export class NutrientController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	private convertMany = (res: Nutrient[]) =>
		res.map((r) => ({ ...r, id: Number(r.id), fdcNutrientId: Number(r.fdcNutrientId) }));
	private convertSingle = (res: Nutrient) => ({
		...res,
		id: Number(res.id),
		fdcNutrientId: Number(res.fdcNutrientId)
	});

	public get = async () => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await prisma.nutrient.findMany().then(this.convertMany);

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);

			const data = await prisma.nutrient
				.findUniqueOrThrow({
					where: { id }
				})
				.then(this.convertSingle);

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getByFdcIds = async (fdcIds: number[]) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ByFdcIds`);

			const data = await prisma.nutrient
				.findMany({
					where: { fdcNumber: { in: fdcIds } }
				})
				.then(this.convertMany);

			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDropdown = async (): Response<{ label: string; value: number }[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}Dropdown`);
			const data = await prisma.nutrient
				.findMany()
				.then((res) => res.map((r) => ({ label: r.name, value: Number(r.id) })));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: NutrientInput) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await prisma.nutrient
				.create({
					data: input
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public import = async (input: NutrientInput[]) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await prisma.nutrient.createMany({
				data: input
			});
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: NutrientInput) => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await prisma.nutrient
				.update({
					data: input,
					where: { id: input.id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number) => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await prisma.nutrient
				.delete({
					where: { id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
