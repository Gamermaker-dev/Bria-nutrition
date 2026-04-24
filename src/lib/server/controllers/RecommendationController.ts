import { type Recommendation, type RecommendationInput } from '$lib/server/db/schema';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';

export class RecommendationController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	private convertMany = (res: Recommendation[]) =>
		res.map((r) => ({
			...r,
			id: Number(r.id),
			physicalTypeId: Number(r.physicalTypeId),
			labelId: Number(r.labelId)
		}));
	private convertSingle = (res: Recommendation) => ({
		...res,
		id: Number(res.id),
		physicalTypeId: Number(res.physicalTypeId),
		labelId: Number(res.labelId)
	});

	public get = async () => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await prisma.recommendation.findMany().then(this.convertMany);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.recommendation
				.findUniqueOrThrow({
					where: { id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getByLabelId = async (labelId: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ByNutrientId`);
			const data = await prisma.recommendation
				.findMany({
					where: { labelId }
				})
				.then(this.convertMany);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: RecommendationInput) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await prisma.recommendation
				.create({
					data: input
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: RecommendationInput) => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await prisma.recommendation
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
			const data = await prisma.recommendation
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
